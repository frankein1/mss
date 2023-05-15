import {
  Beneficiary,
  Followup,
  HelpRequest,
  FollowupType
} from '@prisma/client'
import { sort } from '~/utils'

export function getBeneficiaryFollowUpTypes(
  beneficiary: Beneficiary & {
    followups: Array<Followup & { types: Array<FollowupType> }>
    helpRequests: Array<HelpRequest & { type: FollowupType }>
  }
): Array<FollowupType> {
  const uniqueFollowUpTypesTuples = {
    ...getUniqueFollowUpTypesTuplesFromFollowups(beneficiary.followups),
    ...getUniqueFollowUpTypesTuplesFromHelpRequests(beneficiary.helpRequests)
  }
  const followUpTypes = Object.values(uniqueFollowUpTypesTuples)
  return sort(followUpTypes as Object[], [
    { field: 'name', sort: '' }
  ]) as Array<FollowupType>
}

function getUniqueFollowUpTypesTuplesFromFollowups(
  followups: Array<Followup & { types: Array<FollowupType> }>
) {
  return followups.reduce((uniques, followup) => {
    if (!followup.types.length) return uniques
    const followupUniqueFollowUpTypes = getUniqueFollowUpTypesFromFollowup(
      followup.types
    )
    return {
      ...uniques,
      ...followupUniqueFollowUpTypes
    }
  }, {})
}

function getUniqueFollowUpTypesFromFollowup(
  followUpTypesArr: Array<FollowupType>
) {
  return followUpTypesArr.reduce(
    (uniques, f) => ({
      ...uniques,
      [f.id]: f
    }),
    {}
  )
}

function getUniqueFollowUpTypesTuplesFromHelpRequests(
  helpRequests: Array<HelpRequest & { type: FollowupType }>
) {
  return helpRequests.reduce((uniques, helpRequest) => {
    if (!helpRequest.type) return uniques
    return {
      ...uniques,
      [helpRequest.type.id]: helpRequest.type
    }
  }, {})
}
