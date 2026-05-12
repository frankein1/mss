import type { SocialSupport, UserRole } from '@prisma/client'
import { NotificationType } from '@prisma/client'
import dayjs from 'dayjs'
import {
  HelpRequestRepo,
  HousingHelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~/server/database'
import { withErrorCapture } from '../utils'
import { getSocialSupportNotificationRecipientIds } from './getNotificationRecipientIds'

function hasDefinedCreatedBy<
  T extends { socialSupport: { createdById: string | null } }
>(item: T): item is T & { createdById: string } {
  return item.socialSupport.createdById !== null
}

const socialSupportSelect = {
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

type SocialSupportForNotification = Pick<
  SocialSupport,
  'id' | 'createdById' | 'beneficiaryId'
> & {
  familyFile?: { referents: { id: string; role: UserRole }[] } | null
}

const getRecipientIds = (
  socialSupport: SocialSupportForNotification
): Set<string> =>
  getSocialSupportNotificationRecipientIds({
    createdById: socialSupport.createdById,
    referents: socialSupport.familyFile?.referents ?? []
  })

async function createSocialSupportNotifications(
  socialSupports: SocialSupportForNotification[],
  type: NotificationType
) {
  const notifications = socialSupports.flatMap(socialSupport =>
    Array.from(getRecipientIds(socialSupport)).map(recipientId => ({
      recipientId,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type
    }))
  )

  return await NotificationRepo.prisma.createMany({ data: notifications })
}

async function createDueInAMonthSocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: dayjs().add(1, 'month').toDate()
    },
    select: socialSupportSelect
  })

  const res = await createSocialSupportNotifications(
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
    select: socialSupportSelect
  })

  const res = await createSocialSupportNotifications(
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

  const endOfSupportHelpRequestSelect = {
    fileInstruction: {
      select: {
        socialSupport: {
          select: socialSupportSelect
        }
      }
    }
  }

  const endOfSupportHelpRequests = await HelpRequestRepo.prisma.findMany({
    select: endOfSupportHelpRequestSelect,
    where: {
      handlingDate
    }
  })

  const endOfSupportHousinhHelpRequests =
    await HousingHelpRequestRepo.prisma.findMany({
      select: endOfSupportHelpRequestSelect,
      where: {
        handlingDate
      }
    })

  const notificationType =
    type === 'EndOfSupport'
      ? NotificationType.EndOfSupport
      : NotificationType.EndOfSupportOneMonth

  const socialSupports = [
    ...endOfSupportHelpRequests,
    ...endOfSupportHousinhHelpRequests
  ]
    .filter(hr => hasDefinedCreatedBy(hr.fileInstruction))
    .map(hr => hr.fileInstruction.socialSupport)

  const res = await createSocialSupportNotifications(
    socialSupports,
    notificationType
  )

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
