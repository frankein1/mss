import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getExaminationDatesHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { Routes } from '~/utils/routing/routes'

export const configRouter = router({
  // FIXME: Je déplacerai ça en fonction des modèles je crois ?
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
  })
})
