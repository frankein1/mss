import { inferAsyncReturnType } from '@trpc/server'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary'

export function getBeneficiaryExportData(
  beneficiary: inferAsyncReturnType<typeof getBeneficiaryAccessibleData>
) {
  return {
    id: beneficiary.beneficiary.id
  }
}
