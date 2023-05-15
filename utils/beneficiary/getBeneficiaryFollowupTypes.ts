import { FollowupType } from '@prisma/client'
import { sort } from '~/utils'
import { BeneficiaryItem } from '~/components/BeneficiaryRow/types'

export function getBeneficiaryFollowUpTypes(
  beneficiary: BeneficiaryItem
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
  followups: BeneficiaryItem['followups']
) {
  return followups.reduce((uniques, followup) => {
    if (!followup.types.length) {
      return uniques
    }
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
  followUpTypesArr: BeneficiaryItem['followups'][0]['types']
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
  helpRequests: BeneficiaryItem['helpRequests']
) {
  return helpRequests.reduce((uniques, helpRequest) => {
    if (!helpRequest.type) {
      return uniques
    }
    return {
      ...uniques,
      [helpRequest.type.id]: helpRequest.type
    }
  }, {})
}
