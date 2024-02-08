import {
  AskedHousing,
  HousingRoomCount,
  HousingType
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const isFirstLabels = {
  true: '1ère demande',
  false: 'Renouvellement'
}

export const isFirstOptions = labelsToOptions({
  true: "d'une 1ère demande",
  false: "d'un renouvellement"
})

export const askedHousingLabels: { [key in AskedHousing]: string } = {
  [AskedHousing.ParcSocial]: 'Parc social',
  [AskedHousing.ParcPrive]: 'Parc privé',
  [AskedHousing.HebergementTemporaire]: 'Hébergement temporaire'
}

export const askedHousingOptions = labelsToOptions(askedHousingLabels)


export const housingTypeIcons: { [key in HousingType]: string } = {
  [HousingType.Appartement]: 'fr-icon-building-fill',
  [HousingType.Maison]: 'fr-icon-home-4-fill'
}

export const housingTypeLabels: { [key in HousingType]: string } = {
  [HousingType.Appartement]: 'Appartement',
  [HousingType.Maison]: 'Maison'
}

export const housingTypeOptions = labelsToOptions(housingTypeLabels)

export const roomCountLabels: { [key in HousingRoomCount]: string } = {
  [HousingRoomCount.One]: 'Studio',
  [HousingRoomCount.Two]: '2',
  [HousingRoomCount.Three]: '3',
  [HousingRoomCount.Four]: '4',
  [HousingRoomCount.Five]: '5',
  [HousingRoomCount.SixAndMore]: '6 ou +'
}

export const roomCountOptions = labelsToOptions(roomCountLabels)
