import { BeneficiaryFamilySituation } from '~/prisma/generated/client'

export function isMarried(familySituation?: BeneficiaryFamilySituation | null) {
  return (
    familySituation === BeneficiaryFamilySituation.Married ||
    familySituation === BeneficiaryFamilySituation.CivilUnion
  )
}
