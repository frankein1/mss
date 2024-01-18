import { HousingHelpRequest, HelpRequest } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

type HousingHelpRequestFieldLabels = Omit<
  HousingHelpRequest,
  keyof Omit<HelpRequest, 'reason'> | 'isFirst'
>

export const housingHelpRequestFieldLabels: FieldLabels<HousingHelpRequestFieldLabels> =
  {
    firstOpeningDate: 'Date de la première demande',
    askedHousing: 'Logement demandé',
    reason: 'Motif de la demande de logement',
    uniqueId: 'Numéro unique de suivi',
    taxHouseholdAdditionalInformation: 'Précisions sur la composition du foyer',
    maxRent: 'Montant maximum du loyer',
    maxCharges: 'Montant maximum des charges',
    housingType: 'Typologie du logement',
    roomCount: 'Nombre de pièces',
    isPmr: "Besoin d'un logement PMR"
  }
