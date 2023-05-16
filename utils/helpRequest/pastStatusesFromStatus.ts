import { HelpRequestStatus } from '@prisma/client'

export const pastStatusesFromStatus = (status: HelpRequestStatus) => {
  switch (status) {
    case HelpRequestStatus.WaitingAdditionalInformation:
      return []
    case HelpRequestStatus.InvestigationOngoing:
      return [HelpRequestStatus.WaitingAdditionalInformation]
    default:
      return [
        HelpRequestStatus.WaitingAdditionalInformation,
        HelpRequestStatus.InvestigationOngoing
      ]
  }
}
