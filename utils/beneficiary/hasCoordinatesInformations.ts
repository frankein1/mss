import { Beneficiary } from '@prisma/client'

export function hasCoordinatesInformations(
  beneficiary: Pick<
    Beneficiary,
    | 'phone1'
    | 'phone2'
    | 'noPhone'
    | 'email'
    | 'street'
    | 'zipcode'
    | 'city'
    | 'addressComplement'
  >
) {
  return (
    beneficiary.phone1 ||
    beneficiary.phone2 ||
    beneficiary.noPhone ||
    beneficiary.email ||
    beneficiary.street ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.addressComplement
  )
}
