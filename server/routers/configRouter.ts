import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getExaminationDatesHandler,
  getInstructorOrganizationHandler,
  getPrescribingOrganizationsHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { getInclusionConnectClient } from '~/server/lib'

export const configRouter = router({
  getAgents: protectedProcedure.query(getAgentsHandler),
  getBeneficiariesCities: protectedProcedure.query(
    getBeneficiariesCitiesHandler
  ),
  getExaminationDates: protectedProcedure
    .input(idSchema.optional())
    .query(getExaminationDatesHandler),
  getStructureFollowupTypes: protectedProcedure.query(
    getStructureFollowupTypesHandler
  ),
  getInclusionConnectEditPasswordUrl: protectedProcedure.query(() => {
    const client = getInclusionConnectClient()
    return client.getEditPasswordUrl()
  }),
  getInclusionConnectRegistrationUrl: protectedProcedure.query(() => {
    const client = getInclusionConnectClient()
    return client.getRegistrationUrl()
  }),
  getPrescribingOrganizations: protectedProcedure.query(
    getPrescribingOrganizationsHandler
  ),
  getInstructorOrganization: protectedProcedure.query(
    getInstructorOrganizationHandler
  )
})
