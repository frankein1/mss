import { FollowupType } from '@prisma/client'
import type {
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  FollowupTypesFromFollowups,
  FollowupTypesFromHelpRequests
} from '~/server/controller/beneficiary.controller'

type FollowupTypeIdAndName = Pick<FollowupType, 'id' | 'name'>
type FollowupTypeSet = { [id: string]: FollowupTypeIdAndName }

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

function sortFollowupTypesByName(
  a: FollowupTypeIdAndName,
  b: FollowupTypeIdAndName
) {
  const insensitiveAName = a.name.toLowerCase()
  const insensitiveBName = b.name.toLowerCase()

  if (insensitiveAName < insensitiveBName) {
    return -1
  }
  if (insensitiveAName > insensitiveBName) {
    return 1
  }
  return 0
}
