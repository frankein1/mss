import {
  Notification,
  Prisma,
  SocialSupport,
  SocialSupportType,
  User
} from '@prisma/client'
import dayjs from 'dayjs'
import { createQuery } from '~/server/route'
import { GetNotificationsInput, getNotificationsSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'
import { takeAndSkipFromPagination } from '~/utils/table'
import { notificationTypeKeys } from '~/client/options'
import { formatUserDisplayName } from '~/utils/user'

const handler = async ({
  ctx: { user },
  input: { onlyUnread, types, perPage, page }
}: {
  ctx: ProtectedAppContext
  input: GetNotificationsInput
}) => {
  const { take, skip } = takeAndSkipFromPagination({ perPage, page })

  const where: Prisma.NotificationWhereInput = {}

  if (onlyUnread) {
    where.read = false
  }
  if (types?.length) {
    where.type = { in: types }
  }

  const [notifications, totalCount] = await Promise.all([
    NotificationRepo.findMany(user, {
      where,
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            usualName: true,
            birthName: true
          }
        },
        socialSupport: {
          select: {
            socialSupportType: true
          }
        },
        itemCreatedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        comment: {
          select: {
            content: true
          }
        }
      },
      orderBy: {
        created: 'desc'
      },
      take,
      skip
    }),
    NotificationRepo.count(user, { where })
  ])

  const formatNotifications = notifications.map(n => ({
    id: n.id,
    documentId: n.documentId,
    socialSupportId: n.socialSupportId,
    type: n.type,
    beneficiary: n.beneficiary,
    created: n.created,
    read: n.read,
    title: notificationTypeKeys.byKey[n.type],
    description: getDescription(n),
    descriptionHint: getDescriptionHint(n),
    detail: n.comment?.content || n.detail
  }))

  return { notifications: formatNotifications, totalCount }
}

export const getNotificationsQuery = createQuery({
  handler,
  inputValidation: getNotificationsSchema,
  securityCheck: AllowSecurityCheck
})

type GetNotificationOutput = Prisma.PromiseReturnType<typeof handler>
export type NotificationItem = GetNotificationOutput['notifications'][number]

function getDescription(notification: Notification) {
  const created = dayjs(notification.created)
  const dateInAMonth = dayjs(notification.created).add(1, 'month')

  switch (notification.type) {
    case 'DueDateOneMonth':
      return getDateNotificationDescription(
        dateInAMonth,
        'Échéance dans un mois',
        'Échéance'
      )
    case 'DueDateToday':
      return getDateNotificationDescription(created, 'Échéance')
    case 'EndOfSupport':
      return getDateNotificationDescription(created, 'Fin de prise en charge')
    case 'NewComment':
      return 'Nouveau commentaire'
    case 'NewDocument':
      return 'Nouveau document'
    case 'NewFileInstructionElement':
      return "Nouveau dossier d'instruction"
    case 'NewFollowupElement':
      return 'Nouvelle synthèse'
    case 'NewSocialSupportSubject':
      return "Ajout d'objet(s) d'accompagnement"
    default:
      return ''
  }
}

function getDescriptionHint(
  notification: Notification & {
    itemCreatedBy: Pick<User, 'firstName' | 'lastName'> | null
    socialSupport: Pick<SocialSupport, 'socialSupportType'> | null
  }
) {
  const userName = notification.itemCreatedBy
    ? formatUserDisplayName(notification.itemCreatedBy)
    : ''

  const isFu =
    notification.socialSupport?.socialSupportType === SocialSupportType.Followup

  switch (notification.type) {
    case 'DueDateOneMonth':
    case 'DueDateToday':
    case 'EndOfSupport':
      return isFu
        ? "sur la synthèse d'entretien"
        : "sur le dossier d'instruction"
    case 'NewComment':
    case 'NewDocument':
    case 'NewFileInstructionElement':
      return `ajouté par ${userName}`
    case 'NewFollowupElement':
      return `ajoutée par ${userName}`
    case 'NewSocialSupportSubject':
      return `ajouté(s) par ${userName}`
    default:
      return ''
  }
}

function getDateNotificationDescription(
  date: dayjs.Dayjs,
  label: string,
  pastLabel?: string
) {
  if (date.isSame(dayjs(), 'date')) {
    return `${label} aujourd'hui`
  }
  if (date.isSame(dayjs().subtract(1, 'day'), 'date')) {
    return `${label} hier`
  }
  if (date.isAfter(dayjs(), 'date')) {
    return `${label} le ${formatDate(date.toDate())}`
  }
  return `${pastLabel || label} passée le ${formatDate(date.toDate())}`
}
