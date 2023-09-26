import { Beneficiary } from '@prisma/client'

export function hasCoordinatesInformations(
  beneficiary: Pick<
    Beneficiary,
    'email' | 'street' | 'zipcode' | 'city' | 'addressComplement'
  >
) {
  return (
    beneficiary.email ||
    beneficiary.street ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.addressComplement
  )
}
