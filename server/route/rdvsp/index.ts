import getAppointmentQuery from './get-appointment.query'
import updateAppointmentStatusMutation from './update-appointment-status.mutation'
import { planAppointment } from './plan-appointment.mutation'
import getAuthStatusQuery from './get-auth-status.query'

export const rdvspRoutes = {
  planAppointment,
  getAppointmentQuery,
  updateAppointmentStatusMutation,
  getAuthStatusQuery
}
