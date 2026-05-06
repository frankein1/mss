import { UserRole, type SocialSupport } from '@prisma/client'
import { NotificationType } from '@prisma/client'
import dayjs from 'dayjs'
import {
  HelpRequestRepo,
  HousingHelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~/server/database'
import { withErrorCapture } from '../utils'

function hasDefinedCreatedBy<
  T extends { socialSupport: { createdById: string | null } }
>(item: T): item is T & { createdById: string } {
  return item.socialSupport.createdById !== null
}

async function createDueSocialSupportNotifications(
  dueSocialSupports: (Pick<
    SocialSupport,
    'id' | 'createdById' | 'beneficiaryId'
  > & {
    familyFile?: { referents: { id: string; role: UserRole }[] } | null
  })[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueFollowupNotifications = dueSocialSupports.flatMap(socialSupport => {
    const recipientIds = new Set<string>() // use Set to avoid duplication

    // ReceptionAgent, Instructor and Referent will receive a notification as they are social support creators
    if (socialSupport.createdById !== null) {
      recipientIds.add(socialSupport.createdById)
    }

    for (const referent of socialSupport.familyFile?.referents ?? []) {
      if (
        referent.role !== UserRole.ReceptionAgent &&
        referent.role !== UserRole.Instructor &&
        referent.role !== UserRole.Referent
      ) {
        recipientIds.add(referent.id)
      }
    }

    return Array.from(recipientIds).map(recipientId => ({
      recipientId,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type
    }))
  })

  return await NotificationRepo.prisma.createMany({
    data: dueFollowupNotifications
  })
}

const select = {
  id: true,
  createdById: true,
  beneficiaryId: true,
  familyFile: {
    select: {
      referents: {
        select: {
          id: true,
          role: true
        }
      }
    }
  }
}

async function createDueInAMonthSocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: dayjs().add(1, 'month').toDate()
    },
    select
  })

  const res = await createDueSocialSupportNotifications(
    dueSocialSupports,
    NotificationType.DueDateOneMonth
  )

  console.log(
    `create-social-support-notifications [${new Date().toISOString()}]: ${res.count} notifications created for supports due in a month`
  )
}

async function createDueTodaySocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: new Date()
    },
    select
  })

  const res = await createDueSocialSupportNotifications(
    dueSocialSupports,
    NotificationType.DueDateToday
  )

  console.log(
    `create-social-support-notifications [${new Date().toISOString()}]: ${res.count} notifications created for supports due today`
  )
}

async function createEndOfSupportHelpRequestNotifications(
  type: 'EndOfSupport' | 'EndOfSupportOneMonth'
) {
  const handlingDate =
    type === 'EndOfSupport' ? new Date() : dayjs().add(1, 'month').toDate()

  const endOfSupportHelpRequests = await HelpRequestRepo.prisma.findMany({
    include: {
      fileInstruction: {
        include: {
          socialSupport: true
        }
      }
    },
    where: {
      handlingDate
    }
  })

  const endOfSupportHousinhHelpRequests =
    await HousingHelpRequestRepo.prisma.findMany({
      include: {
        fileInstruction: {
          include: {
            socialSupport: true
          }
        }
      },
      where: {
        handlingDate
      }
    })

  const endOfSupportHelpRequestNotifications = [
    ...endOfSupportHelpRequests,
    ...endOfSupportHousinhHelpRequests
  ]
    .filter(hr => hasDefinedCreatedBy(hr.fileInstruction))
    .map(({ fileInstruction: { socialSupport } }) => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type:
        type === 'EndOfSupport'
          ? NotificationType.EndOfSupport
          : NotificationType.EndOfSupportOneMonth
    }))

  const res = await NotificationRepo.prisma.createMany({
    data: endOfSupportHelpRequestNotifications
  })

  console.log(
    `create-social-support-notifications [${new Date().toISOString()}]: ${res.count} notifications created for help request end of support ${type === 'EndOfSupport' ? 'today' : 'in a month'}`
  )
}

export default {
  createDueInAMonthSocialSupportNotifications: async () =>
    await withErrorCapture(createDueInAMonthSocialSupportNotifications),
  createDueTodaySocialSupportNotifications: async () =>
    await withErrorCapture(createDueTodaySocialSupportNotifications),
  createEndOfSupportTodayHelpRequestNotifications: async () =>
    withErrorCapture(() =>
      createEndOfSupportHelpRequestNotifications('EndOfSupport')
    ),
  createEndOfSupportInAMonthHelpRequestNotifications: async () =>
    withErrorCapture(() =>
      createEndOfSupportHelpRequestNotifications('EndOfSupportOneMonth')
    )
}
