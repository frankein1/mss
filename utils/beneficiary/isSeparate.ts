import { BeneficiaryFamilySituation } from '@prisma/client'

export function isSeparate(
  familySituation?: BeneficiaryFamilySituation | null
) {
  return (
    familySituation === BeneficiaryFamilySituation.Divorced ||
    familySituation === BeneficiaryFamilySituation.Separated ||
    familySituation === BeneficiaryFamilySituation.SingleParentWithChildren
  )
}
