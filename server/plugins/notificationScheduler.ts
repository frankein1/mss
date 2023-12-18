import { NotificationType, HelpRequest, Followup } from '@prisma/client'
import dayjs from 'dayjs'
import {
  FollowupRepo,
  HelpRequestRepo,
  NotificationRepo
} from '~/server/database'
import { useScheduler } from '#scheduler'

export default defineNitroPlugin(() => {
  startScheduler()
})

function hasDefinedCreatedBy<T extends { createdById: string | null }>(
  item: T
): item is T & { createdById: string } {
  return item.createdById !== null
}

async function createDueFollowupNotifications(
  dueFollowups: Followup[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueFollowupNotifications = dueFollowups
    .filter(hasDefinedCreatedBy)
    .map(({ id, createdById, beneficiaryId }) => ({
      recipientId: createdById,
      beneficiaryId,
      followupId: id,
      type,
      itemCreatedById: createdById
    }))

  await NotificationRepo.prisma.createMany({
    data: dueFollowupNotifications
  })
}

async function createDueInAMonthFollowupNotifications() {
  const dueFollowups = await FollowupRepo.prisma.findMany({
    where: {
      dueDate: dayjs().add(1, 'month').toDate()
    }
  })

  await createDueFollowupNotifications(
    dueFollowups,
    NotificationType.DueDateOneMonth
  )
}

async function createDueTodayFollowupNotifications() {
  const dueFollowups = await FollowupRepo.prisma.findMany({
    where: {
      dueDate: new Date()
    }
  })

  await createDueFollowupNotifications(
    dueFollowups,
    NotificationType.DueDateToday
  )
}

async function createDueHelpRequestNotifications(
  dueHelpRequests: HelpRequest[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueHelpRequestNotifications = dueHelpRequests
    .filter(hasDefinedCreatedBy)
    .map(({ id, createdById, beneficiaryId }) => ({
      recipientId: createdById,
      beneficiaryId,
      helpRequestId: id,
      type,
      itemCreatedById: createdById
    }))

  await NotificationRepo.prisma.createMany({
    data: dueHelpRequestNotifications
  })
}

async function createDueInAMonthHelpRequestNotifications() {
  const dueHelpRequests = await HelpRequestRepo.prisma.findMany({
    where: {
      dueDate: dayjs().add(1, 'month').toDate()
    }
  })

  await createDueHelpRequestNotifications(
    dueHelpRequests,
    NotificationType.DueDateOneMonth
  )
}

async function createDueTodayHelpRequestNotifications() {
  const dueHelpRequests = await HelpRequestRepo.prisma.findMany({
    where: {
      dueDate: new Date()
    }
  })

  await createDueHelpRequestNotifications(
    dueHelpRequests,
    NotificationType.DueDateToday
  )
}

async function createEndOfSupportHelpRequestNotifications() {
  const endOfSupportHelpRequests = await HelpRequestRepo.prisma.findMany({
    where: {
      handlingDate: new Date()
    }
  })

  const endOfSupportHelpRequestNotifications = endOfSupportHelpRequests
    .filter(hasDefinedCreatedBy)
    .map(({ id, createdById, beneficiaryId }) => ({
      recipientId: createdById,
      beneficiaryId,
      helpRequestId: id,
      type: NotificationType.EndOfSupport,
      itemCreatedById: createdById
    }))

  await NotificationRepo.prisma.createMany({
    data: endOfSupportHelpRequestNotifications
  })
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler
    .run(async () => {
      await createDueInAMonthFollowupNotifications()
      await createDueTodayFollowupNotifications()
      await createDueInAMonthHelpRequestNotifications()
      await createDueTodayHelpRequestNotifications()
      await createEndOfSupportHelpRequestNotifications()
    })
    .dailyAt(1, 0)
}
