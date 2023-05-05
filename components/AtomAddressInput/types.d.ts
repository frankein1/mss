export type BanAddress = {
  id: string
  name: string
  postcode: string
  city: string
  context: string
}

export type BanQueryParams = {
  q: string
  limit: number
  postcode?: string
}

export type BanResponse = { features: Array<{ properties: BanAddress }> }

export type AddressSelected = {
  zipCode: string
  city: string
  region: string
}
