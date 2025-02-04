import { planAppointment } from './planAppointment.service'
import { getAppointments } from './getAppointments.service'
import { validateDraftAppointment } from './validateDraftAppointment.service'

export const RdvspService = {
  planAppointment,
  getAppointments,
  validateDraftAppointment
}
