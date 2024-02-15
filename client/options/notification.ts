import { NotificationType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const notificationTypeLabels: { [key in NotificationType]: string } = {
  [NotificationType.DueDateToday]: "Échéance - Aujourd'hui",
  [NotificationType.DueDateOneMonth]: 'Échéance - Dans un mois',
  [NotificationType.EndOfSupport]: 'Fin de prise en charge',
  [NotificationType.NewComment]: 'Nouveau commentaire',
  [NotificationType.NewDocument]: 'Nouveau document',
  [NotificationType.NewHistoryElement]: 'Nouveau suivi'
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
