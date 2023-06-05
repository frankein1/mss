import {
  StructureType,
  Beneficiary,
  Document,
  Followup,
  FollowupIntervention,
  FollowupSignalement,
  FollowupType,
  User
} from '@prisma/client'
import { AddFollowupInput, EditFollowupInput } from '~/server/schema'

export type FollowupTarget = Followup & {
  beneficiary: Beneficiary & {
    referents: User[]
  }
  documents: Document[]
  types: FollowupType[]
}

export function prepareMinistryData(
  type: StructureType,
  interventionBooleans: { [k in FollowupIntervention]: boolean },
  signalementBooleans: { [k in FollowupSignalement]: boolean },
  {
    numeroPegase,
    ministre,
    classified,
    forwardedToJustice
  }: Pick<
    AddFollowupInput | EditFollowupInput,
    'numeroPegase' | 'ministre' | 'classified' | 'forwardedToJustice'
  >
) {
  if (type === StructureType.Ministere) {
    const interventions = Object.entries(interventionBooleans).reduce(
      (interventions, [intervention, enabled]) => {
        if (enabled) {
          return [...interventions, intervention as FollowupIntervention]
        }
        return interventions
      },
      [] as FollowupIntervention[]
    )

    const signalements = Object.entries(signalementBooleans).reduce(
      (signalements, [signalement, enabled]) => {
        if (enabled) {
          return [...signalements, signalement as FollowupSignalement]
        }
        return signalements
      },
      [] as FollowupSignalement[]
    )

    return {
      numeroPegase,
      ministre,
      classified,
      forwardedToJustice,
      interventions,
      signalements
    }
  }

  return {}
}

export function prepareFollowupTypesMutations(
  inputTypes: string[],
  targetTypes?: FollowupType[]
) {
  return {
    connect: inputTypes.map(id => ({ id })),
    disconnect: targetTypes
      ?.filter(({ id }) => !inputTypes.includes(id))
      .map(({ id }) => ({ id }))
  }
}
