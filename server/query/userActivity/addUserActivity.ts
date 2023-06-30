import { Prisma, UserActivityType } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export type AddUserActivityInput = {
  transaction?: Prisma.TransactionClient
  userId: string
  object:
    | 'Comment'
    | 'Beneficiary'
    | 'HelpRequest'
    | 'Followup'
    | 'Structure'
    | 'Document'
    | 'Notification'
    | 'User'
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
  await conn.userActivity.create({
    data: {
      userId: user.id,
      structureId: user.structureId,
      object: input.object,
      objectId: input.objectId,
      activity: input.activity
    }
  })
}
