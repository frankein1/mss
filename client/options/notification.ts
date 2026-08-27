import { NotificationType } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const notificationTypeKeys = buildKeys({
  [NotificationType.DueDateToday]: 'Échéance',
  [NotificationType.DueDateOneMonth]: 'Échéance',
  [NotificationType.EndOfSupport]: 'Échéance',
  [NotificationType.EndOfSupportOneMonth]: 'Échéance',
  [NotificationType.NewComment]: 'Commentaire',
  [NotificationType.NewDocument]: 'Document',
  [NotificationType.DocumentExpirationToday]: 'Échéance',
  [NotificationType.DocumentExpirationOneMonth]: 'Échéance',
  [NotificationType.NewFileInstructionElement]: 'Instruction',
  [NotificationType.UpdateFileInstructionElement]: 'Instruction',
  [NotificationType.NewFollowupElement]: 'Synthèse',
  [NotificationType.UpdateFollowupElement]: 'Synthèse',
  [NotificationType.NewSocialSupportSubject]: 'Configuration',
  [NotificationType.ArchiveDueToday]: 'Archive',
  [NotificationType.ArchiveDueOneMonth]: 'Archive',
  [NotificationType.ArchiveDueSevenDays]: 'Archive',
  [NotificationType.SupportProgramEndToday]: 'Échéance',
  [NotificationType.SupportProgramEndOneMonth]: 'Échéance'
})

export enum NotificationTypeFilterValue {
  DueDate = 'DueDate',
  NewComment = 'NewComment',
  NewItem = 'NewItem',
  Archivage = 'Archivage'
}

export const notificationTypeFilterKeys = buildKeys({
  [NotificationTypeFilterValue.DueDate]: 'Échéances',
  [NotificationType.NewComment]: 'Commentaires',
  [NotificationTypeFilterValue.NewItem]: 'Ajouts par un tiers',
  [NotificationTypeFilterValue.Archivage]: 'Archivage'
})
