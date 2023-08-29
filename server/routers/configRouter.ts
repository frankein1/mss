import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getExaminationDatesHandler,
  getInstructorOrganizationHandler,
  getPrescribingOrganizationsHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router, publicProcedure } from '~/server/trpc'
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
  getPrescribingOrganizations: protectedProcedure.query(
    getPrescribingOrganizationsHandler
  ),
  getInstructorOrganization: protectedProcedure.query(
    getInstructorOrganizationHandler
  ),
  testSentry: publicProcedure.query(() => {
    throw new Error('Test sentry backend')
  })
})
