import type { StructureType } from '@prisma/client'

export type BanAddress = {
  id: string
  banId: string
  name: string
  postcode: string
  label: string
  score: number
  housenumber?: string
  citycode: string
  x: number
  y: number
  city: string
  context: string
  type: string
  importance: number
  depcode?: string
  street?: string
  _type: string
}

export type BanQueryParams = {
  q: string
  limit: number
  postcode?: string
}

export type BanFeature = {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: BanAddress
}

export type BanResponse = {
  type: 'FeatureCollection'
  features: BanFeature[]
  query: string
}

export type AddressSelected = {
  zipCode: string
  city: string
  region: string
  departement: string
  coordinates: [number, number]
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
  limit: number | null
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

export type StructureOption = {
  id: string
  name: string
  type: StructureType
  city: string
  zipcode: string
  disabled?: boolean
}
