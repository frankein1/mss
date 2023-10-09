import {
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests,
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests
} from '~/server/route/beneficiary'
import { FollowupTypeIdAndName } from '~/types/followupType'
import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'

type FollowupTypeSet = { [id: string]: FollowupTypeIdAndName }

function getUniqueFollowUpTypesTuplesFromFollowups(
  followups: FollowupTypesFromFollowups
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
  }, {} as FollowupTypeSet)
}

function getUniqueFollowUpTypesFromFollowup(
  followUpTypesArr: FollowupTypesFromFollowups[0]['types']
) {
  return followUpTypesArr.reduce(
    (uniques, f) => ({
      ...uniques,
      [f.id]: f
    }),
    {} as FollowupTypeSet
  )
}

function getUniqueFollowUpTypesTuplesFromHelpRequests(
  helpRequests: FollowupTypesFromHelpRequests
) {
  return helpRequests.reduce((uniques, helpRequest) => {
    if (!helpRequest.type) {
      return uniques
    }
    return {
      ...uniques,
      [helpRequest.type.id]: helpRequest.type
    }
  }, {} as FollowupTypeSet)
}

export function getBeneficiaryFollowUpTypes({
  followups,
  helpRequests
}: Pick<
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  'followups' | 'helpRequests'
>): FollowupTypeIdAndName[] {
  const uniqueFollowUpTypesTuples = {
    ...getUniqueFollowUpTypesTuplesFromFollowups(followups),
    ...getUniqueFollowUpTypesTuplesFromHelpRequests(helpRequests)
  }
  const followUpTypes = Object.values(uniqueFollowUpTypesTuples)
  return followUpTypes.sort(sortFollowupTypesByName)
}
