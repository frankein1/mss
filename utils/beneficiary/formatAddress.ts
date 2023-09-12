import { Beneficiary } from '@prisma/client'

export function formatAddress(
  address: Pick<Beneficiary, 'street' | 'zipcode' | 'city' | 'region'>
) {
  return [address.street, address.zipcode, address.city, address.region]
    .filter(Boolean)
    .join(', ')
}
