export type GeoApiGouvFrCommune = {
  nom: string
  codesPostaux: string[]
  codeRegion: string
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
}

export type CitySelected = {
  zipCode: string
  city: string
  codeRegion: string
}
