import { protectedProcedure, router } from '~~/server/trpc'
import {
  getAgentsQuery,
  getBeneficiariesCitiesQuery,
  getBeneficiariesSchoolsQuery,
  getExaminationDatesQuery
} from '~~/server/route/config'

export const configRouter = router({
  getAgents: protectedProcedure
    .input(getAgentsQuery.inputValidation)
    .query(getAgentsQuery.execute),
  getBeneficiariesCities: protectedProcedure
    .input(getBeneficiariesCitiesQuery.inputValidation)
    .query(getBeneficiariesCitiesQuery.execute),
  getBeneficiariesSchools: protectedProcedure
    .input(getBeneficiariesSchoolsQuery.inputValidation)
    .query(getBeneficiariesSchoolsQuery.execute),
  getExaminationDates: protectedProcedure
    .input(getExaminationDatesQuery.inputValidation)
    .query(getExaminationDatesQuery.execute)
})
