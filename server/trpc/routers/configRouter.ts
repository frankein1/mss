import { protectedProcedure, router } from '~/server/trpc'
import { getProConnectClient, getInclusionConnectClient } from '~/server/lib'
import {
  getAgentsQuery,
  getBeneficiariesCitiesQuery,
  getExaminationDatesQuery
} from '~/server/route/config'
import { isProConnectActive } from '~/utils/isProConnectActive'

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
  getEditPasswordUrl: protectedProcedure.query(() => {
    const client = getProConnectClient()
    return client.getEditPasswordUrl()
  }),
  getEditPasswordUrlInclusionConnect: protectedProcedure.query(() => {
    const client = getInclusionConnectClient()
    return client.getEditPasswordUrl()
  })
})
