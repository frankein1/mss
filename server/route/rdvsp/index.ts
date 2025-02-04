import { planAppointment } from './plan-appointment.mutation'
import { getAppointments } from './get-appointments.query'
import { validateDraftAppointment } from './validate-draft-appointment.mutation'

export const rdvspRoutes = {
  planAppointment,
  getAppointments,
  validateDraftAppointment
}
