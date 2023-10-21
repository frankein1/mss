import { HelpRequestStatus } from '@prisma/client'

export const helpRequestStatusClasses: {
  [key in HelpRequestStatus]: string
} = {
  [HelpRequestStatus.Accepted]: 'fr-badge--success',
  [HelpRequestStatus.InvestigationOngoing]: 'fr-badge--info',
  [HelpRequestStatus.Refused]: 'fr-badge--error',
  [HelpRequestStatus.WaitingAdditionalInformation]: 'fr-badge--info',
  [HelpRequestStatus.ClosedByBeneficiary]: 'fr-badge--error ',
  [HelpRequestStatus.Dismissed]: 'fr-badge--error',
  [HelpRequestStatus.Adjourned]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-warning-fill'
}
