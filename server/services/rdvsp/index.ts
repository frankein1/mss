import getAppointment from './get-appointment.service'
import updateAppointmentStatus from './update-appointment-status.service'
import getAppointments from './get-appointments.service'
import { planAppointment } from './planAppointment.service'
import getAuthStatus from './get-auth-status.service'

export const RdvspService = {
  planAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  getAuthStatus
}
