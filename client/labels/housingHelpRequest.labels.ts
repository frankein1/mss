import { HousingHelpRequest, HelpRequest } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

type HousingHelpRequestFieldLabels = Omit<
  HousingHelpRequest,
  | keyof HelpRequest
  | 'isFirst'
  | 'uniqueId'
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
    askedHousing: 'Logement demandé'
  }
