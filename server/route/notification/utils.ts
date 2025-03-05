import {
  Notification,
  SocialSupport,
  SocialSupportType,
  User
} from '@prisma/client'
import dayjs from 'dayjs'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'

export const notificationInclude = {
  beneficiary: {
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true,
      familyFile: {
        select: {
          id: true
        }
      }
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
}

export function getDescription(notification: Notification) {
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
    case 'UpdateFileInstructionElement':
      return "Mise à jour dossier d'instruction"
    case 'NewFollowupElement':
      return 'Nouvelle synthèse'
    case 'UpdateFollowupElement':
      return 'Mise à jour synthèse'
    case 'NewSocialSupportSubject':
      return "Ajout d'objet(s) d'accompagnement"
    case 'ArchiveDue':
      return 'Gérer le dossier'
    default:
      return ''
  }
}

export function getDescriptionHint(
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

  const archiveMessage = notification.archiveDate
    ? `Dossier sans activité depuis 2 ans : suppression prévue le ${notification.archiveDate.toLocaleDateString()}.`
    : `Dossier sans activité depuis 2 ans.`

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
    case 'UpdateFileInstructionElement':
      return `modifiée par ${userName}`
    case 'NewFollowupElement':
      return `ajoutée par ${userName}`
    case 'UpdateFollowupElement':
      return `modifiée par ${userName}`
    case 'NewSocialSupportSubject':
      return `ajouté(s) par ${userName}`
    case 'ArchiveDue':
      return archiveMessage
    default:
      return ''
  }
}

export function getDateNotificationDescription(
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
