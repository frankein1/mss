import { NotificationType, SocialSupport } from '@prisma/client'
import dayjs from 'dayjs'
import {
  HelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~/server/database'
import { useScheduler } from '#scheduler'
import { notificationTypeKeys } from '~/client/options'

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
      type,
      title: notificationTypeKeys.byKey[type],
      descriptionHint:
        socialSupport.socialSupportType === 'Followup'
          ? "sur la synthèse d'entretien"
          : "sur l'instruction de dossier"
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
      helpRequestId: socialSupport.id,
      type: NotificationType.EndOfSupport
    }))

  await NotificationRepo.prisma.createMany({
    data: endOfSupportHelpRequestNotifications
  })
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
}
