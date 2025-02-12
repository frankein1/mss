import { protectedProcedure, router } from '~/server/trpc'
import { rdvspRoutes } from '~/server/route'

export const rdvspRouter = router({
  planAppointment: protectedProcedure
    .input(rdvspRoutes.planAppointment.inputValidation)
    .mutation(rdvspRoutes.planAppointment.execute),
  getAppointments: protectedProcedure
    .input(rdvspRoutes.getAppointments.inputValidation)
    .query(rdvspRoutes.getAppointments.execute)
})
