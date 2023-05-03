import { HelpRequestStatus } from '@prisma/client'

export const helpRequestStatusBadgeClasses: {
  [key in HelpRequestStatus]: string
} = {
  [HelpRequestStatus.Accepted]: 'fr-badge--success',
  [HelpRequestStatus.InvestigationOngoing]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [HelpRequestStatus.Refused]: 'fr-badge--error',
  [HelpRequestStatus.WaitingAdditionalInformation]:
    'fr-badge--info fr-badge--icon-left fr-icon-time-line',
  [HelpRequestStatus.ClosedByBeneficiary]: 'fr-badge--error ',
  [HelpRequestStatus.Dismissed]: 'fr-badge--error',
  [HelpRequestStatus.Adjourned]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-error-line'
}
