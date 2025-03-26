import { TRPCClientError } from '@trpc/client'

export enum MSS_ERROR_CODES {
  BENEFICIARY_ALREADY_LINKED_TO_FAMILY_FILE = 'BENEFICIARY_ALREADY_LINKED_TO_FAMILY_FILE',
  FAMILIY_FILE_HAS_MULTIPLE_BENEFICIARIES = 'FAMILIY_FILE_HAS_MULTIPLE_BENEFICIARIES'
}

export interface TRPCClientErrorWithMSSCode extends TRPCClientError<any> {
  data: {
    MSS_CODE: MSS_ERROR_CODES
  }
}

export function isTRPCClientErrorWithMSSCode(
  error: unknown
): error is TRPCClientErrorWithMSSCode {
  if (!(error instanceof TRPCClientError)) {
    return false
  }
  return 'MSS_CODE' in error.data
}
