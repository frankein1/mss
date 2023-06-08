import { Prisma, NotificationType } from '@prisma/client'
import { useScheduler } from '#scheduler'
import { prismaClient } from '~/server/prisma'

export default defineNitroPlugin(() => {
  startScheduler()
})

function hasDefinedCreatedBy<T extends { createdById: string | null }>(
  item: T
): item is T & { createdById: string } {
  return item.createdById !== null
}

async function createDueFollowupNotifications() {
  const dueFollowups = await prismaClient.followup.findMany({
    where: {
      dueDate: new Date()
    }
  })

  const dueFollowupNotifications: Prisma.Enumerable<Prisma.NotificationCreateManyInput> =
    dueFollowups
      .filter(hasDefinedCreatedBy)
      .map(({ id, createdById, beneficiaryId }) => ({
        recipientId: createdById,
        beneficiaryId,
        followupId: id,
        type: NotificationType.DueDate
      }))

  await prismaClient.notification.createMany({
    data: dueFollowupNotifications
  })
}

async function createDueHelpRequestNotifications() {
  const dueHelpRequests = await prismaClient.helpRequest.findMany({
    where: {
      dueDate: new Date()
    }
  })

  const dueHelpRequestNotifications: Prisma.Enumerable<Prisma.NotificationCreateManyInput> =
    dueHelpRequests
      .filter(hasDefinedCreatedBy)
      .map(({ id, createdById, beneficiaryId }) => ({
        recipientId: createdById,
        beneficiaryId,
        helpRequestId: id,
        type: NotificationType.DueDate
      }))

  await prismaClient.notification.createMany({
    data: dueHelpRequestNotifications
  })
}

async function createEndOfSupportHelpRequestNotifications() {
  const endOfSupportHelpRequests = await prismaClient.helpRequest.findMany({
    where: {
      handlingDate: new Date()
    }
  })

  const endOfSupportHelpRequestNotifications: Prisma.Enumerable<Prisma.NotificationCreateManyInput> =
    endOfSupportHelpRequests
      .filter(hasDefinedCreatedBy)
      .map(({ id, createdById, beneficiaryId }) => ({
        recipientId: createdById,
        beneficiaryId,
        helpRequestId: id,
        type: NotificationType.EndOfSupport
      }))

  await prismaClient.notification.createMany({
    data: endOfSupportHelpRequestNotifications
  })
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler
    .run(async () => {
      await createDueFollowupNotifications()
      await createDueHelpRequestNotifications()
      await createEndOfSupportHelpRequestNotifications()
    })
    .dailyAt(1, 0)
}
