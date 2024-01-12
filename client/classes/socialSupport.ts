import { SocialSupportStatus } from '@prisma/client'

export const socialSupportStatusClasses = {
  [SocialSupportStatus.Todo]: 'fr-badge--info',
  [SocialSupportStatus.InProgress]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [SocialSupportStatus.Done]:
    'fr-badge--success fr-badge--icon-left fr-icon-check-line',
  [SocialSupportStatus.Accepted]: 'fr-badge--success',
  [SocialSupportStatus.InvestigationOngoing]: 'fr-badge--info',
  [SocialSupportStatus.Refused]: 'fr-badge--error',
  [SocialSupportStatus.WaitingAdditionalInformation]: 'fr-badge--info',
  [SocialSupportStatus.ClosedByBeneficiary]: 'fr-badge--error ',
  [SocialSupportStatus.ClosedByAgent]: 'fr-badge--error ',
  [SocialSupportStatus.Dismissed]: 'fr-badge--error',
  [SocialSupportStatus.Adjourned]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-warning-fill'
}
