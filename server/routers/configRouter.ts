import {
  getAgentsHandler,
  getBeneficiariesCitiesHandler,
  getExaminationDatesHandler,
  getStructureFollowupTypesHandler
} from '../controller/config.controller'
import { protectedProcedure, router } from '~/server/trpc'

export const configRouter = router({
  // FIXME: Je déplacerai ça en fonction des modèles je crois ?
  getAgents: protectedProcedure.query(getAgentsHandler),
  getBeneficiariesCities: protectedProcedure.query(
    getBeneficiariesCitiesHandler
  ),
  getExaminationDates: protectedProcedure.query(getExaminationDatesHandler),
  getStructureFollowupTypes: protectedProcedure.query(
    getStructureFollowupTypesHandler
  )
})
