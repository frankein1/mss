import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getExaminationDatesHandler,
  getInstructorOrganizationHandler,
  getPrescribingOrganizationsHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { Routes } from '~/utils/routing/routes'

export const configRouter = router({
  getAgents: protectedProcedure.query(getAgentsHandler),
  getBeneficiariesCities: protectedProcedure.query(
    getBeneficiariesCitiesHandler
  ),
  getExaminationDates: protectedProcedure.query(getExaminationDatesHandler),
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
      referrer_uri: `${appUrl}${Routes.Account()}`
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
