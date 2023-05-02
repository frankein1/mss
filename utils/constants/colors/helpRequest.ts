import { HelpRequestStatus } from '@prisma/client'

export const helpRequestStatusColors: { [key in HelpRequestStatus]: string } = {
  [HelpRequestStatus.WaitingAdditionalInformation]: '#fcc63a',
  [HelpRequestStatus.InvestigationOngoing]: '#7AB1E8',
  [HelpRequestStatus.Accepted]: '#3bea7e',
  [HelpRequestStatus.Refused]: '#FF732C',
  [HelpRequestStatus.Adjourned]: '#6f45f7',
  [HelpRequestStatus.ClosedByBeneficiary]: '#f95c5e',
  [HelpRequestStatus.Dismissed]: '#CE70CC'
}
