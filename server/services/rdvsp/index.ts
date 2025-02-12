import { planAppointment } from './planAppointment.service'
import { getAppointments } from './getAppointments.service'
import { validateDraftAppointmentsForFamilyFile } from './validateDraftAppointment.service'

export const RdvspService = {
  planAppointment,
  getAppointments,
  validateDraftAppointmentsForFamilyFile
}
