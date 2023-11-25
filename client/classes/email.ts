import { EmailStatus } from '@prisma/client'

export const emailStatusBadgeClasses: {
  [key in EmailStatus]: string
} = {
  [EmailStatus.Sent]: 'fr-badge--success',
  [EmailStatus.Error]: 'fr-badge--error',
  [EmailStatus.Sending]: 'fr-badge--new',
  [EmailStatus.ToSend]: 'fr-badge--info'
}
