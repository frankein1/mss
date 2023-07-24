import { inferAsyncReturnType } from '@trpc/server'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'

export function getBeneficiaryExportData(
  beneficiary: inferAsyncReturnType<typeof getBeneficiaryAccessibleData>
) {
  return {
    id: beneficiary.beneficiary.id
  }
}
