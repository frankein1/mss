import { NotificationType } from '@prisma/client'

export const notificationTypeClasses: { [key in NotificationType]: string } = {
  [NotificationType.DueDateToday]: 'fr-icon-calendar-check-line',
  [NotificationType.DueDateOneMonth]: 'fr-icon-calendar-check-line',
  [NotificationType.EndOfSupport]: 'fr-icon-timer-line',
  [NotificationType.NewComment]: 'fr-icon-message-2-line',
  [NotificationType.NewDocument]: 'fr-icon-file-text-line'
}
