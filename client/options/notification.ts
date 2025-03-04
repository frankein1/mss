import { NotificationType } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const notificationTypeKeys = buildKeys({
  [NotificationType.DueDateToday]: 'Échéance',
  [NotificationType.DueDateOneMonth]: 'Échéance',
  [NotificationType.EndOfSupport]: 'Échéance',
  [NotificationType.NewComment]: 'Commentaire',
  [NotificationType.NewDocument]: 'Document',
  [NotificationType.NewFileInstructionElement]: 'Instruction',
  [NotificationType.UpdateFileInstructionElement]: 'Instruction',
  [NotificationType.NewFollowupElement]: 'Synthèse',
  [NotificationType.UpdateFollowupElement]: 'Synthèse',
  [NotificationType.NewSocialSupportSubject]: 'Configuration',
  [NotificationType.ArchiveDue]: 'Archive'
})

export enum NotificationTypeFilterValue {
  DueDate = 'DueDate',
  NewComment = 'NewComment',
  NewItem = 'NewItem',
  Archive = 'Archive'
}

export const notificationTypeFilterKeys = buildKeys({
  [NotificationTypeFilterValue.DueDate]: 'Échéances',
  [NotificationType.NewComment]: 'Commentaires',
  [NotificationTypeFilterValue.NewItem]: 'Ajouts par un tiers',
  [NotificationTypeFilterValue.Archive]: 'Archives'
})
