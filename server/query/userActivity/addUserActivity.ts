import type { Prisma } from '@prisma/client'
import { UserActivityType, UserActivityObject } from '@prisma/client'
import {
  createOrUpdateStructure,
  createOrUpdateUser
} from '~/server/integrations/brevo/service'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

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
  const { user, key, object, objectId, activity, content } = input

  const activityDate = new Date()
  const activityData = {
    key,
    userId: user.id,
    object,
    objectId,
    activity,
    date: activityDate,
    content
  }

  // Do not await, failure shouldn't cause the entire mutation to fail
  createOrUpdateUser(user.id).catch(error => {
    console.error(error)
  })
  if (
    object === UserActivityObject.User &&
    activity === UserActivityType.UPDATE
  ) {
    // If the operation is a mutation targeting another user,
    // then we must update the targeted user on Brevo
    // (eg. an administrator changed a user's email)
    createOrUpdateUser(objectId).catch(error => {
      console.error(error)
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
      console.error(error)
    })
  }
  if (user.structureId) {
    await prismaClient.structure.update({
      where: { id: user.structureId },
      data: {
        lastActivity: activityDate,
        userActivities: {
          create: activityData
        }
      }
    })
    // Do not await, failure shouldn't cause the entire mutation to fail
    createOrUpdateStructure(user.structureId).catch(error => {
      console.error(error)
    })
  } else {
    await prismaClient.userActivity.create({
      data: {
        structureId: user.structureId,
        ...activityData
      }
    })
  }
}
