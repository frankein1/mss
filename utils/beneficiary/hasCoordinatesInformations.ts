import { Beneficiary } from '@prisma/client'

export function hasCoordinatesInformations(
  beneficiary: Pick<
    Beneficiary,
    | 'street'
    | 'zipcode'
    | 'city'
    | 'region'
    | 'noPhone'
    | 'phone1'
    | 'phone2'
    | 'email'
  >
) {
  return (
    beneficiary.noPhone ||
    beneficiary.phone1 ||
    beneficiary.phone2 ||
    beneficiary.email ||
    beneficiary.street ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.region
  )
}
