import { NotificationType } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const notificationTypeKeys = buildKeys({
  [NotificationType.DueDateToday]: 'Échéance',
  [NotificationType.DueDateOneMonth]: 'Échéance',
  [NotificationType.EndOfSupport]: 'Échéance',
  [NotificationType.NewComment]: 'Commentaire',
  [NotificationType.NewDocument]: 'Document',
  [NotificationType.NewFileInstructionElement]: 'instruction',
  [NotificationType.NewFollowupElement]: 'Synthèse',
  [NotificationType.NewSocialSupportSubject]: 'Configuration'
})

export enum NotificationTypeFilterValue {
  DueDate = 'DueDate',
  NewComment = 'NewComment',
  NewItem = 'NewItem'
}

export const notificationTypeFilterKeys = buildKeys({
  [NotificationTypeFilterValue.DueDate]: 'Échéances',
  [NotificationType.NewComment]: 'Commentaires',
  [NotificationTypeFilterValue.NewItem]: 'Ajouts par un tiers'
})
