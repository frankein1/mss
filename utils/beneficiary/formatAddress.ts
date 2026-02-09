import type { Beneficiary } from '~/prisma/generated/client'

export function formatAddress(
  address: Pick<Beneficiary, 'street' | 'zipcode' | 'city' | 'region'>
) {
  return [address.street, address.zipcode, address.city, address.region]
    .filter(Boolean)
    .join(', ')
}
