import { StructureType } from '@prisma/client'

export type FollowupHiddableFields =
  | 'numeroPegase'
  | 'ministre'
  | 'classified'
  | 'forwardedToJustice'
  | 'Prefecture'
  | 'Bailleur'
  | 'ActionLogement'
  | 'SecoursMedecinTraitant'
  | 'ChefCabinet'
  | 'Prefet'
  | 'OrganismeMenace'
  | 'signalements'
  | 'interventions'

type StructureTypePermissions = {
  hiddenFields: FollowupHiddableFields[]
}

const hiddenFields: FollowupHiddableFields[] = [
  'numeroPegase',
  'ministre',
  'classified',
  'forwardedToJustice',
  'Prefecture',
  'Bailleur',
  'ActionLogement',
  'SecoursMedecinTraitant',
  'ChefCabinet',
  'Prefet',
  'OrganismeMenace',
  'signalements',
  'interventions'
]

const permissions: {
  [key in StructureType]: StructureTypePermissions
} = {
  [StructureType.Association]: {
    hiddenFields
  },
  [StructureType.Ccas]: {
    hiddenFields
  },
  [StructureType.Cias]: {
    hiddenFields
  },
  [StructureType.Commune]: {
    hiddenFields
  },
  [StructureType.EFS]: {
    hiddenFields
  },
  [StructureType.Ministere]: {
    hiddenFields: []
  }
}

export function hasAccessFollowupField(
  structureType: StructureType | undefined,
  fieldKey: FollowupHiddableFields
) {
  if (!structureType) {
    return false
  }
  return !permissions[structureType].hiddenFields.includes(fieldKey)
}

export function hasAccessfollowupFields(
  structureType: StructureType | undefined,
  fieldKeys: string[]
) {
  if (!structureType) {
    return false
  }
  return !(fieldKeys.filter(key => key in hiddenFields).length > 0)
}
