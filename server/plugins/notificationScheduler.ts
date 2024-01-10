import { NotificationType, SocialSupport } from '@prisma/client'
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

function hasDefinedCreatedBy<
  T extends { socialSupport: { createdById: string | null } }
>(item: T): item is T & { createdById: string } {
  return item.socialSupport.createdById !== null
}

async function createDueFollowupNotifications(
  dueFollowups: { socialSupport: SocialSupport }[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueFollowupNotifications = dueFollowups
    .filter(hasDefinedCreatedBy)
    .map(({ socialSupport }) => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type,
      itemCreatedById: socialSupport.createdById
    }))

  await NotificationRepo.prisma.createMany({
    data: dueFollowupNotifications
  })
}

async function createDueInAMonthFollowupNotifications() {
  const dueFollowups = await FollowupRepo.prisma.findMany({
    include: {
      socialSupport: true
    },
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
    include: {
      socialSupport: true
    },
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
  dueHelpRequests: { socialSupport: SocialSupport }[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueHelpRequestNotifications = dueHelpRequests
    .filter(hasDefinedCreatedBy)
    .map(({ socialSupport }) => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type,
      itemCreatedById: socialSupport.createdById
    }))

  await NotificationRepo.prisma.createMany({
    data: dueHelpRequestNotifications
  })
}

async function createDueInAMonthHelpRequestNotifications() {
  const dueHelpRequests = await HelpRequestRepo.prisma.findMany({
    include: {
      socialSupport: true
    },
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
    include: {
      socialSupport: true
    },
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
    include: {
      socialSupport: true
    },
    where: {
      handlingDate: new Date()
    }
  })

  const endOfSupportHelpRequestNotifications = endOfSupportHelpRequests
    .filter(hasDefinedCreatedBy)
    .map(({ socialSupport }) => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      helpRequestId: socialSupport.id,
      type: NotificationType.EndOfSupport,
      itemCreatedById: socialSupport.createdById
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
