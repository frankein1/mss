import { Beneficiary } from '@prisma/client'

export function hasCoordinatesInformations(
  beneficiary: Pick<
    Beneficiary,
    'street' | 'zipcode' | 'city' | 'accommodationMode' | 'region'
  >
) {
  return (
    beneficiary.street ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.region ||
    beneficiary.accommodationMode
  )
}
