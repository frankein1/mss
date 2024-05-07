import { BeneficiaryFamilySituation } from '@prisma/client'

export function isMarried(familySituation?: BeneficiaryFamilySituation | null) {
  return (
    familySituation === BeneficiaryFamilySituation.Married ||
    familySituation === BeneficiaryFamilySituation.CivilUnion
  )
}
