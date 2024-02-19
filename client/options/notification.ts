import { NotificationType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const notificationTypeTitles: { [key in NotificationType]: string } = {
  [NotificationType.DueDateToday]: 'Échéance',
  [NotificationType.DueDateOneMonth]: 'Échéance',
  [NotificationType.EndOfSupport]: 'Échéance',
  [NotificationType.NewComment]: 'Commentaire',
  [NotificationType.NewDocument]: 'Document',
  [NotificationType.NewHistoryElement]: ''
}

export enum NotificationTypeFilterValue {
  DueDate = 'DueDate',
  NewComment = 'NewComment',
  NewItem = 'NewItem'
}

export const notificationTypeFilterLabels: {
  [key in NotificationTypeFilterValue]: string
} = {
  [NotificationTypeFilterValue.DueDate]: 'Échéances',
  [NotificationType.NewComment]: 'Commentaires',
  [NotificationTypeFilterValue.NewItem]: 'Ajouts par un tiers'
}

export const notificationTypeFilterOptions = labelsToOptions(
  notificationTypeFilterLabels
)
