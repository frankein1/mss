import { FollowupStatus } from '@prisma/client'

export const followupStatusClasses: { [key in FollowupStatus]: string } = {
  [FollowupStatus.Todo]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [FollowupStatus.InProgress]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [FollowupStatus.Done]:
    'fr-badge--success fr-badge--icon-left fr-icon-check-line'
}
