import { Prisma, UserActivityType, UserActivityObject } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export type AddUserActivityInput = {
  transaction?: Prisma.TransactionClient
  userId: string
  object: UserActivityObject
  objectId: string
  activity: UserActivityType
}

export async function addUserActivity(input: AddUserActivityInput) {
  const conn = input.transaction ? input.transaction : prismaClient
  const user = await conn.user.findUnique({
    where: {
      id: input.userId
    }
  })
  if (!user) {
    return
  }
  const activityDate = new Date()
  const activityData = {
    userId: user.id,
    object: input.object,
    objectId: input.objectId,
    activity: input.activity,
    date: activityDate
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
  } else {
    await conn.userActivity.create({
      data: {
        structureId: user.structureId,
        ...activityData
      }
    })
  }
}
