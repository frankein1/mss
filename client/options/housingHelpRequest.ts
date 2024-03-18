import {
  AskedHousing,
  HousingReason,
  HousingRoomCount,
  HousingType
} from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const isFirstKeys = buildKeys({
  true: '1ère demande',
  false: 'Renouvellement'
})

export const askedHousingKeys = buildKeys({
  [AskedHousing.ParcSocial]: 'Parc social',
  [AskedHousing.ParcPrive]: 'Parc privé',
  [AskedHousing.HebergementTemporaire]: 'Hébergement temporaire'
})

export const housingTypeIcons = {
  [HousingType.Appartement]: 'fr-icon-building-fill',
  [HousingType.Maison]: 'fr-icon-home-4-fill'
}

export const housingTypeKeys = buildKeys({
  [HousingType.Appartement]: 'Appartement',
  [HousingType.Maison]: 'Maison'
})

export const roomCountKeys = buildKeys({
  [HousingRoomCount.One]: 'Studio',
  [HousingRoomCount.Two]: '2',
  [HousingRoomCount.Three]: '3',
  [HousingRoomCount.Four]: '4',
  [HousingRoomCount.Five]: '5',
  [HousingRoomCount.SixAndMore]: '6 ou +'
})

export const housingReasonKeys = buildKeys({
  [HousingReason.Violences]: 'Violences',
  [HousingReason.DivorceSeparation]: 'Divorce ou séparation',
  [HousingReason.RapprochementFamilial]: 'Rapprochement familial',
  [HousingReason.Mutation]: 'Mutation',
  [HousingReason.Expulsion]: 'Expulsion',
  [HousingReason.LogementInsalubre]: 'Logement insalubre',
  [HousingReason.LogementNonDecent]: 'Logement non décent',
  [HousingReason.LogementReprisVente]: 'Logement repris ou mis en vente',
  [HousingReason.LogementInadapte]: 'Logement inadapté',
  [HousingReason.LogementTropCher]: 'Logement trop cher',
  [HousingReason.LogementBientotDemoli]: 'Logement bientôt démoli',
  [HousingReason.Localisation]: 'Localisation du logement',
  [HousingReason.SansLogementOuTemporaire]:
    'Sans logement ou logement temporaire'
})
