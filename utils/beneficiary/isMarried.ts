import { BeneficiaryFamilySituation } from '~/prisma/generated/browser'

export function isMarried(familySituation?: BeneficiaryFamilySituation | null) {
  return (
    familySituation === BeneficiaryFamilySituation.Married ||
    familySituation === BeneficiaryFamilySituation.CivilUnion
  )
}
