import type { Beneficiary } from '~/prisma/generated/browser'

export function hasAdditionalInformations(
  beneficiary: Pick<Beneficiary, 'additionalInformation'>
) {
  return !!beneficiary.additionalInformation
}
