import { AskedHousing, HousingReason } from '@prisma/client'

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

export const reasonLabels: { [key in HousingReason]: string } = {
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
}

export const reasonOptions = labelsToOptions(reasonLabels)
