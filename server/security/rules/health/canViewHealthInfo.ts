import { StructureType } from '@prisma/client'

export const canViewHealthInfo = (structureType: StructureType): boolean => {
  return (
    structureType !== StructureType.Ccas && structureType !== StructureType.Cias
  )
}
