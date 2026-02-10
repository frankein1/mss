import { EmailStatus } from '~/prisma/generated/browser'

export const emailStatusBadgeClasses: {
  [key in EmailStatus]: string
} = {
  [EmailStatus.Sent]: 'fr-badge--success',
  [EmailStatus.Error]: 'fr-badge--error',
  [EmailStatus.Sending]: 'fr-badge--new',
  [EmailStatus.ToSend]: 'fr-badge--info'
}
