import { Beneficiary } from '@prisma/client'

function hasAddress(
  beneficiary: Pick<Beneficiary, 'street' | 'zipcode' | 'city' | 'region'>
) {
  return (
    beneficiary.street ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.region
  )
}

export function hasPhoneOrAddress(
  beneficiary: Pick<
    Beneficiary,
    'street' | 'zipcode' | 'city' | 'region' | 'noPhone' | 'phone1' | 'phone2'
  >
) {
  return (
    beneficiary.noPhone ||
    beneficiary.phone1 ||
    beneficiary.phone2 ||
    hasAddress(beneficiary)
  )
}

export function hasEmailOrAddressComplement(
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
    | 'addressComplement'
  >
) {
  return (
    beneficiary.email ||
    (hasAddress(beneficiary) && beneficiary.addressComplement)
  )
}

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
    | 'addressComplement'
  >
) {
  return (
    hasPhoneOrAddress(beneficiary) || hasEmailOrAddressComplement(beneficiary)
  )
}
