import { StructureType } from '@prisma/client'

export type BeneficiaryBlock =
  | 'header'
  | 'followupTypes'
  | 'general'
  | 'health'
  | 'taxHouseholds'
  | 'entourages'
  | 'externalOrganisations'
  | 'occupationIncome'

export type BeneficiaryHiddableFields =
  | 'numeroPegase'
  | 'nir'
  | 'accommodationZone'

type StructureTypePermissions = {
  hiddenBlocks: BeneficiaryBlock[]
  hiddenFields: BeneficiaryHiddableFields[]
}

const beneficiaryFormPermissions: {
  [key in StructureType]: StructureTypePermissions
} = {
  [StructureType.Association]: {
    hiddenBlocks: [],
    hiddenFields: ['nir', 'numeroPegase', 'accommodationZone']
  },
  [StructureType.Ccas]: {
    hiddenBlocks: [],
    hiddenFields: ['numeroPegase', 'accommodationZone']
  },
  [StructureType.Cias]: {
    hiddenBlocks: [],
    hiddenFields: ['numeroPegase', 'accommodationZone']
  },
  [StructureType.Commune]: {
    hiddenBlocks: [],
    hiddenFields: ['nir']
  },
  [StructureType.EFS]: {
    hiddenBlocks: ['taxHouseholds', 'entourages', 'health', 'occupationIncome'],
    hiddenFields: []
  },
  [StructureType.Ministere]: {
    hiddenBlocks: [],
    hiddenFields: ['nir']
  }
}

export function hasAccessBeneficiaryBlock(
  structureType: StructureType,
  blockKey: BeneficiaryBlock
) {
  return !beneficiaryFormPermissions[structureType].hiddenBlocks.includes(
    blockKey
  )
}

export function hasAccessBeneficiaryField(
  structureType: StructureType | undefined,
  fieldKey: BeneficiaryHiddableFields
) {
  if (!structureType) {
    return false
  }
  return !beneficiaryFormPermissions[structureType].hiddenFields.includes(
    fieldKey
  )
}
