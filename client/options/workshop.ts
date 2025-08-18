import { PeriodFilter } from '~/utils/constants/filters'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const workshopPeriodFilterKeys = buildKeys({
  [PeriodFilter.ThisYear]: 'Cette année',
  [PeriodFilter.ThisMonth]: 'Ce mois-ci',
  [PeriodFilter.Custom]: 'Personnalisée'
})
