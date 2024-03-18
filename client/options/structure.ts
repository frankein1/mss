import { StructureType } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const structureTypeKeys = buildKeys({
  [StructureType.Ccas]: 'CCAS',
  [StructureType.Cias]: 'CIAS',
  [StructureType.Association]: 'Association',
  [StructureType.Commune]: 'Commune',
  [StructureType.Ministere]: 'Ministère'
})
