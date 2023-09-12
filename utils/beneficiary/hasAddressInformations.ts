import { Beneficiary } from '@prisma/client'

export function hasAddressInformations(
  beneficiary: Pick<
    Beneficiary,
    | 'accommodationMode'
    | 'accommodationAdditionalInformation'
    | 'accommodationZone'
    | 'street'
    | 'streetNumber'
    | 'zipcode'
    | 'city'
    | 'addressComplement'
    | 'region'
  >
) {
  return (
    beneficiary.accommodationMode ||
    beneficiary.accommodationAdditionalInformation ||
    beneficiary.accommodationZone ||
    beneficiary.street ||
    beneficiary.streetNumber ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.addressComplement ||
    beneficiary.region
  )
}
