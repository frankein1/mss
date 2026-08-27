import { NotificationType } from '@prisma/client'

export const notificationTypeClasses: { [key in NotificationType]: string } = {
  [NotificationType.DueDateToday]: 'fr-icon-calendar-event-line',
  [NotificationType.DueDateOneMonth]: 'fr-icon-calendar-event-line',
  [NotificationType.EndOfSupport]: 'fr-icon-calendar-event-line',
  [NotificationType.EndOfSupportOneMonth]: 'fr-icon-calendar-event-line',
  [NotificationType.NewComment]: 'fr-icon-message-2-line',
  [NotificationType.NewDocument]: 'fr-icon-file-text-line',
  [NotificationType.DocumentExpirationToday]: 'fr-icon-file-text-line',
  [NotificationType.DocumentExpirationOneMonth]: 'fr-icon-file-text-line',
  [NotificationType.NewFollowupElement]: 'fr-icon-draft-line',
  [NotificationType.UpdateFollowupElement]: 'fr-icon-draft-line',
  [NotificationType.NewFileInstructionElement]: 'fr-icon-questionnaire-line',
  [NotificationType.UpdateFileInstructionElement]: 'fr-icon-questionnaire-line',
  [NotificationType.NewSocialSupportSubject]: 'fr-icon-settings-5-line',
  [NotificationType.ArchiveDueToday]: 'ri-folder-close-line',
  [NotificationType.ArchiveDueOneMonth]: 'ri-folder-close-line',
  [NotificationType.ArchiveDueSevenDays]: 'ri-folder-close-line',
  [NotificationType.SupportProgramEndToday]: 'fr-icon-calendar-event-line',
  [NotificationType.SupportProgramEndOneMonth]: 'fr-icon-calendar-event-line'
}
