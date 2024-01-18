import { HousingHelpRequest, HelpRequest } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

type HousingHelpRequestFieldLabels = Omit<
  HousingHelpRequest,
  | keyof Omit<HelpRequest, 'reason'>
  | 'isFirst'
  | 'taxHouseholdAdditionalInformation'
  | 'maxRent'
  | 'maxCharges'
  | 'housingType'
  | 'roomCount'
  | 'isPmr'
>

export const housingHelpRequestFieldLabels: FieldLabels<HousingHelpRequestFieldLabels> =
  {
    firstOpeningDate: 'Date de la première demande',
    askedHousing: 'Logement demandé',
    reason: 'Motif de la demande de logement',
    uniqueId: 'Numéro unique de suivi'
  }
