import { protectedProcedure, router } from '~/server/trpc'
import { rdvspRoutes } from '~/server/route'

export const rdvspRouter = router({
  getAppointment: protectedProcedure
    .input(rdvspRoutes.getAppointmentQuery.inputValidation)
    .query(rdvspRoutes.getAppointmentQuery.execute),
  getAgentUpcomingAppointments: protectedProcedure
    .input(rdvspRoutes.getAgentUpcomingAppointmentsQuery.inputValidation)
    .query(rdvspRoutes.getAgentUpcomingAppointmentsQuery.execute),
  updateAppointmentStatus: protectedProcedure
    .input(rdvspRoutes.updateAppointmentStatusMutation.inputValidation)
    .mutation(rdvspRoutes.updateAppointmentStatusMutation.execute),
  planAppointment: protectedProcedure
    .input(rdvspRoutes.planAppointment.inputValidation)
    .mutation(rdvspRoutes.planAppointment.execute),
  getAuthStatus: protectedProcedure
    .input(rdvspRoutes.getAuthStatusQuery.inputValidation)
    .query(rdvspRoutes.getAuthStatusQuery.execute)
})
