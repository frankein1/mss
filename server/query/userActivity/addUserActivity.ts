import { Prisma, UserActivityType, UserActivityObject } from '@prisma/client'
import { diff as diffJson } from 'json-diff'
import {
  createOrUpdateStructure,
  createOrUpdateUser
} from '~/server/integrations/brevo/service'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'
import { logger } from '~/server/plugins/logger'

export type AddUserActivityInput = {
  transaction?: Prisma.TransactionClient
  key: string
  user: SecurityRuleGrantee
  object: UserActivityObject
  objectId: string
  activity: UserActivityType
  content?: any
}

export async function addUserActivity(input: AddUserActivityInput) {
  const conn = input.transaction ? input.transaction : prismaClient

  const { user, key, object, objectId, activity, content } = input

  const lastAuditLog = await prismaClient.userActivity.findFirst({
    orderBy: {
      date: 'desc'
    },
    select: {
      id: true,
      content: true
    },
    where: {
      key,
      object,
      objectId,
      content: {
        not: Prisma.JsonNull
      }
    }
  })

  let diff
  if (lastAuditLog) {
    const { id: lastId, content: lastContent } = lastAuditLog
    const { content } = input
    diff = diffJson(lastContent, content)

    // only to minimise database size
    await conn.userActivity.update({
      data: {
        content: Prisma.JsonNull
      },
      where: {
        id: lastId
      }
    })
  }

  const activityDate = new Date()
  const activityData = {
    key,
    userId: user.id,
    object,
    objectId,
    activity,
    date: activityDate,
    content,
    diff
  }
  // Do not await, failure shouldn't cause the entire mutation to fail
  createOrUpdateUser(user.id).catch(error => {
    logger.error(error)
  })
  if (
    object === UserActivityObject.User &&
    activity === UserActivityType.UPDATE
  ) {
    // If the operation is a mutation targeting another user,
    // then we must update the targeted user on Brevo
    // (eg. an administrator changed a user's email)
    createOrUpdateUser(objectId).catch(error => {
      logger.error(error)
    })
  }
  if (
    object === UserActivityObject.Structure &&
    activity === UserActivityType.UPDATE
  ) {
    // If the operation is a mutation targeting a structure,
    // then we must update the targeted structure on Brevo
    // (eg. an administrator changed a structure's name or address)
    createOrUpdateStructure(objectId).catch(error => {
      logger.error(error)
    })
  }
  if (user.structureId) {
    await conn.structure.update({
      where: { id: user.structureId },
      data: {
        // Forced to use an external field `lastActivity`, used by orderBy (in admin section's structures table)
        // Cf. https://github.com/prisma/prisma/issues/5837 & https://github.com/prisma/prisma/issues/7593 (no orderBy for relations)
        lastActivity: activityDate,
        userActivities: {
          create: activityData
        }
      }
    })
    // Do not await, failure shouldn't cause the entire mutation to fail
    createOrUpdateStructure(user.structureId).catch(error => {
      logger.error(error)
    })
  } else {
    await conn.userActivity.create({
      data: {
        structureId: user.structureId,
        ...activityData
      }
    })
  }
}
