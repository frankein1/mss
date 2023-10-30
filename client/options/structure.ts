import { StructureType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const StructureTypeLabels: { [key in StructureType]: string } = {
  [StructureType.Ccas]: 'CCAS',
  [StructureType.Cias]: 'CIAS',
  [StructureType.Association]: 'Association',
  [StructureType.Commune]: 'Commune',
  [StructureType.Ministere]: 'Ministère',
  [StructureType.EFS]: 'Etablissement France Service'
}

export const structureTypeOptions = labelsToOptions(StructureTypeLabels)
