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
  departement: string
}

export type GeoApiGouvFrCommune = {
  nom: string
  codesPostaux: string[]
  codeRegion: string
  codeDepartement: string
}

export type GeoApiGouvFrRegion = {
  nom: string
  code: string
}

export type GeoApiGouvFrDepartment = {
  nom: string
  code: string
}

export type GeoApiGouvFrQueryParams = {
  nom: string
  limit: number
  codePostal?: string
}

export type CityResult = {
  nom: string
  codePostal: string
  codeRegion: string
  codeDepartement: string
}

export type CitySelected = {
  zipCode: string
  city: string
  codeRegion: string
  codeDepartement: string
}
