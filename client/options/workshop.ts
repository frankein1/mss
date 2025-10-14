import { WorkshopAttendeeAttendance } from '@prisma/client'
import { PeriodFilter } from '~/utils/constants/filters'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const workshopPeriodFilterKeys = buildKeys({
  [PeriodFilter.ThisYear]: 'Cette année',
  [PeriodFilter.ThisMonth]: 'Ce mois-ci',
  [PeriodFilter.Custom]: 'Personnalisée'
})

export const workshopAttendeeAttendanceKeys = buildKeys({
  [WorkshopAttendeeAttendance.Excused]: 'Absence excusée',
  [WorkshopAttendeeAttendance.NoShow]: 'Absence',
  [WorkshopAttendeeAttendance.Seen]: 'Présence'
})

export const paymentReceivedKeys = buildKeys({
  true: 'Payé',
  false: 'Non payé'
})
