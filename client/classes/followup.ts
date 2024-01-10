import { SocialSupportStatus } from '@prisma/client'

export const followupStatusClasses = {
  [SocialSupportStatus.Todo]: 'fr-badge--info',
  [SocialSupportStatus.InProgress]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [SocialSupportStatus.Done]:
    'fr-badge--success fr-badge--icon-left fr-icon-check-line'
}
