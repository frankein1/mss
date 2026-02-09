import type { Beneficiary } from '~/prisma/generated/client'

export function hasAdditionalInformations(
  beneficiary: Pick<Beneficiary, 'additionalInformation'>
) {
  return !!beneficiary.additionalInformation
}
