import { SocialSupportStatus } from '@prisma/client'

export const helpRequestStatusColors = {
  [SocialSupportStatus.WaitingAdditionalInformation]: '#fcc63a',
  [SocialSupportStatus.InvestigationOngoing]: '#7AB1E8',
  [SocialSupportStatus.Accepted]: '#3bea7e',
  [SocialSupportStatus.Refused]: '#FF732C',
  [SocialSupportStatus.Adjourned]: '#6f45f7',
  [SocialSupportStatus.ClosedByBeneficiary]: '#f95c5e',
  [SocialSupportStatus.ClosedByAgent]: '#c9191e',
  [SocialSupportStatus.Dismissed]: '#CE70CC'
}
