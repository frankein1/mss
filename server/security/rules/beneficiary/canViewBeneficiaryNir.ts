import { StructureType } from '@prisma/client'

export const canViewBeneficiaryNir = (
  type: StructureType | undefined
): boolean =>
  type === StructureType.Ccas ||
  type === StructureType.Cias ||
  type === StructureType.Commune
