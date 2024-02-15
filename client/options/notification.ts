import { NotificationType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export enum NotificationTypeFilterValue {
  DueDate = 'DueDate',
  NewComment = 'NewComment',
  NewItem = 'NewItem'
}

export const notificationTypeLabels: {
  [key in NotificationTypeFilterValue]: string
} = {
  [NotificationTypeFilterValue.DueDate]: 'Échéances',
  [NotificationType.NewComment]: 'Commentaires',
  [NotificationTypeFilterValue.NewItem]: 'Ajouts par un tiers'
}

export const notificationTypeOptions = labelsToOptions(notificationTypeLabels)
