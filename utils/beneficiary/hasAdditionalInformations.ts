import { Beneficiary } from '@prisma/client'

export function hasAdditionalInformations(
  beneficiary: Pick<Beneficiary, 'additionalInformation'>
) {
  return !!beneficiary.additionalInformation
}
