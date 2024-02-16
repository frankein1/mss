import { protectedProcedure, router } from '~/server/trpc'
import { getInclusionConnectClient } from '~/server/lib'
import {
  getAgentsQuery,
  getBeneficiariesCitiesQuery,
  // getExaminationDatesQuery,
  getPartnerOrganizationsQuery,
  getStructureFollowupTypesQuery
} from '~/server/route/config'

export const configRouter = router({
  getAgents: protectedProcedure
    .input(getAgentsQuery.inputValidation)
    .query(getAgentsQuery.execute),
  getBeneficiariesCities: protectedProcedure
    .input(getBeneficiariesCitiesQuery.inputValidation)
    .query(getBeneficiariesCitiesQuery.execute),
  // getExaminationDates: protectedProcedure
  //   .input(getExaminationDatesQuery.inputValidation)
  //   .query(getExaminationDatesQuery.execute),
  getStructureFollowupTypes: protectedProcedure
    .input(getStructureFollowupTypesQuery.inputValidation)
    .query(getStructureFollowupTypesQuery.execute),
  getInclusionConnectEditPasswordUrl: protectedProcedure.query(() => {
    const client = getInclusionConnectClient()
    return client.getEditPasswordUrl()
  }),
  getPartnerOrganizations: protectedProcedure
    .input(getPartnerOrganizationsQuery.inputValidation)
    .query(getPartnerOrganizationsQuery.execute)
})
