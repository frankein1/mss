import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getExaminationDatesHandler,
  getInstructorOrganizationHandler,
  getPrescribingOrganizationsHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { RoutePath } from '~/utils/routing'
import { idSchema } from '~/server/schema'

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
  getInclusionConnectLogoutUrl: protectedProcedure.query(() => {
    const {
      public: { appUrl },
      auth
    } = useRuntimeConfig()

    const { keycloakIssuer, keycloakClientId } = auth

    const inclusionConnectAccountUrlBase = `${keycloakIssuer}/account`

    const params = new URLSearchParams({
      referrer: keycloakClientId,
      referrer_uri: `${appUrl}${RoutePath.Account()}`
    })
    return `${inclusionConnectAccountUrlBase}?${params}`
  }),
  getPrescribingOrganizations: protectedProcedure.query(
    getPrescribingOrganizationsHandler
  ),
  getInstructorOrganization: protectedProcedure.query(
    getInstructorOrganizationHandler
  )
})
