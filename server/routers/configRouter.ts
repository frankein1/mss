import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router } from '~/server/trpc'

export const configRouter = router({
  getAgents: protectedProcedure.query(getAgentsHandler),
  getBeneficiariesCities: protectedProcedure.query(
    getBeneficiariesCitiesHandler
  ),
  getStructureFollowupTypes: protectedProcedure.query(
    getStructureFollowupTypesHandler
  )
})
