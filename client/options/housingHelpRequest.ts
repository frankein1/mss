import { AskedHousing } from '@prisma/client'

export const isFirstLabels = {
  true: "d'une 1ère demande",
  false: "d'un renouvellement"
}

export const isFirstOptions = labelsToOptions(isFirstLabels)

export const askedHousingLabels: { [key in AskedHousing]: string } = {
  [AskedHousing.ParcSocial]: 'Parc social',
  [AskedHousing.ParcPrive]: 'Parc privé',
  [AskedHousing.HebergementTemporaire]: 'Hébergement temporaire'
}

export const askedHousingOptions = labelsToOptions(askedHousingLabels)
