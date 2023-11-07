import { StructureType } from '@prisma/client'

export type HelpRequestHiddableFields = 'numeroPegase' | 'ministre'

type StructureTypePermissions = {
  hiddenFields: HelpRequestHiddableFields[]
}

const hiddenFields: HelpRequestHiddableFields[] = ['numeroPegase', 'ministre']

const helpRequestFormPermissions: {
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

export function hasAccessHelpRequestField(
  structureType: StructureType | undefined,
  fieldKey: HelpRequestHiddableFields
) {
  if (!structureType) {
    return false
  }
  return !helpRequestFormPermissions[structureType].hiddenFields.includes(
    fieldKey
  )
}

export function hasAccessHelpRequestFields(
  structureType: StructureType | undefined,
  fieldKeys: string[]
) {
  if (!structureType) {
    return false
  }
  return !(fieldKeys.filter(key => key in hiddenFields).length > 0)
}
