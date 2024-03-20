import { protectedProcedure, router } from '~/server/trpc'
import { getInclusionConnectClient } from '~/server/lib'
import {
  getAgentsQuery,
  getBeneficiariesCitiesQuery,
  getExaminationDatesQuery
} from '~/server/route/config'

export const configRouter = router({
  getAgents: protectedProcedure
    .input(getAgentsQuery.inputValidation)
    .query(getAgentsQuery.execute),
  getBeneficiariesCities: protectedProcedure
    .input(getBeneficiariesCitiesQuery.inputValidation)
    .query(getBeneficiariesCitiesQuery.execute),
  getExaminationDates: protectedProcedure
    .input(getExaminationDatesQuery.inputValidation)
    .query(getExaminationDatesQuery.execute),
  getInclusionConnectEditPasswordUrl: protectedProcedure.query(() => {
    const client = getInclusionConnectClient()
    return client.getEditPasswordUrl()
  })
})
