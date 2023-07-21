import { getBeneficiaryDisplayName } from '~/utils/beneficiary/getBeneficiaryDisplayName'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import {
  followupInterventionLabels,
  followupMediumLabels,
  followupSignalementLabels,
  followupStatusLabels
} from '~/client/options/followup'
import { ministerLabels } from '~/client/options/ministry'
import { getFollowupAccessibleData } from '~/utils/followup/getFollowupAccessibleData'

export function getFollowupExportData(
  followup: ReturnType<typeof getFollowupAccessibleData>
) {
  return {
    id: followup.id,
    date: formatDate(followup.date, 'DD-MM-YYYY'),
    firstFollowup: getBooleanOrEmpty(followup.firstFollowup),
    status: followupStatusLabels[followup.status],
    redirected: getBooleanOrEmpty(followup.redirected),
    types: followup.types.map(type => type.name).join(','),
    beneficiaryId: getBeneficiaryDisplayName(followup.beneficiary),
    medium: followup.medium ? followupMediumLabels[followup.medium] : '',
    classified: getBooleanOrEmpty(followup.classified),
    documents:
      followup.documents?.map(document => document.name).join(',') || '',
    dueDate: formatDate(followup.dueDate, 'DD-MM-YYYY'),
    forwardedToJustice: getBooleanOrEmpty(followup.forwardedToJustice),
    helpRequested: getBooleanOrEmpty(followup.helpRequested),
    interventions: followup.interventions
      ? followup.interventions
          .map(intervention => followupInterventionLabels[intervention])
          .join(',')
      : '',
    ministre: followup.ministre ? ministerLabels[followup.ministre] : '',
    numeroPegase: followup.numeroPegase || '',
    place: followup.place || '',
    prescribingOrganizationId: followup.prescribingOrganization?.name || '',
    // TODO: export comments, depending on structures' feedbacks
    signalements: followup.signalements
      ? followup.signalements
          .map(signalement => followupSignalementLabels[signalement])
          .join(',')
      : '',
    structureName: followup.structureName || '',
    synthesis: followup.synthesis || '',
    thirdPersonName: followup.thirdPersonName || '',
    updated: formatDate(followup.updated, 'DD-MM-YYYY HH:mm')
  }
}
