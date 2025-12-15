import type { SocialSupport } from '@prisma/client'
import { NotificationType } from '@prisma/client'
import dayjs from 'dayjs'
import {
  HelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~/server/database'
import { useScheduler } from '#scheduler'
import { createArchiveDueOneMonthNotifications } from '~/server/services/notification/create-archive-due-one-month-notifications.service'
import { createArchiveDueRemindersNotifications } from '~/server/services/notification/create-archive-reminders-notifications.service'

export default defineNitroPlugin(() => {
  startScheduler()
})

function socialSupportHasDefinedCreatedBy<
  T extends { createdById: string | null }
>(item: T): item is T & { createdById: string } {
  return item.createdById !== null
}

function hasDefinedCreatedBy<
  T extends { socialSupport: { createdById: string | null } }
>(item: T): item is T & { createdById: string } {
  return item.socialSupport.createdById !== null
}

async function createDueSocialSupportNotifications(
  dueSocialSupports: SocialSupport[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueFollowupNotifications = dueSocialSupports
    .filter(socialSupportHasDefinedCreatedBy)
    .map(socialSupport => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type
    }))

  await NotificationRepo.prisma.createMany({
    data: dueFollowupNotifications
  })
}

async function createDueInAMonthSocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: dayjs().add(1, 'month').toDate()
    }
  })

  await createDueSocialSupportNotifications(
    dueSocialSupports,
    NotificationType.DueDateOneMonth
  )
}

async function createDueTodaySocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: new Date()
    }
  })

  await createDueSocialSupportNotifications(
    dueSocialSupports,
    NotificationType.DueDateToday
  )
}

async function createEndOfSupportHelpRequestNotifications() {
  const endOfSupportHelpRequests = await HelpRequestRepo.prisma.findMany({
    include: {
      fileInstruction: {
        include: {
          socialSupport: true
        }
      }
    },
    where: {
      handlingDate: new Date()
    }
  })

  const endOfSupportHelpRequestNotifications = endOfSupportHelpRequests
    .filter(hr => hasDefinedCreatedBy(hr.fileInstruction))
    .map(({ fileInstruction: { socialSupport } }) => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type: NotificationType.EndOfSupport
    }))

  await NotificationRepo.prisma.createMany({
    data: endOfSupportHelpRequestNotifications
  })
}

function archiveScheduler() {
  const scheduler = useScheduler()
  const { public: publicConfig } = useRuntimeConfig()

  const isLocalOrDev = ['local', 'development'].includes(
    publicConfig.mssEnvironment
  )
  // For test on dev deployment use 30 min scheduler
  if (isLocalOrDev) {
    scheduler
      .run(async () => {
        await createArchiveDueOneMonthNotifications()
        await createArchiveDueRemindersNotifications()
      })
      .everyThirtyMinutes()
    return
  }

  scheduler.run(createArchiveDueOneMonthNotifications).cron('0 1 * * 0') // At 02:00 on Sunday
  scheduler.run(createArchiveDueRemindersNotifications).dailyAt(2, 0)
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler
    .run(async () => {
      await createDueInAMonthSocialSupportNotifications()
      await createDueTodaySocialSupportNotifications()
      await createEndOfSupportHelpRequestNotifications()
    })
    .dailyAt(1, 0)

  archiveScheduler()
}
