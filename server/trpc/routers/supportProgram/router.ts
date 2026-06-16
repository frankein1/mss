import { supportProgramRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const supportProgramRouter = router({
  update: protectedProcedure
    .input(routes.updateSupportProgramsMutation.inputValidation)
    .mutation(routes.updateSupportProgramsMutation.execute),
  getNameList: protectedProcedure
    .input(routes.getSupportProgramNameListQuery.inputValidation)
    .query(routes.getSupportProgramNameListQuery.execute),
  getForBeneficiary: protectedProcedure
    .input(routes.getSupportProgramsForBeneficiaryQuery.inputValidation)
    .query(routes.getSupportProgramsForBeneficiaryQuery.execute),
  checkHasFollowup: protectedProcedure
    .input(routes.checkSupportProgramHasFollowupQuery.inputValidation)
    .query(routes.checkSupportProgramHasFollowupQuery.execute),
  getNamesForFamilyFile: protectedProcedure
    .input(routes.getSupportProgramNamesForFamilyFileQuery.inputValidation)
    .query(routes.getSupportProgramNamesForFamilyFileQuery.execute),
  upsertName: protectedProcedure
    .input(routes.upsertNameMutation.inputValidation)
    .mutation(routes.upsertNameMutation.execute),
  deleteName: protectedProcedure
    .input(routes.deleteNameMutation.inputValidation)
    .mutation(routes.deleteNameMutation.execute),
  countNameUsage: protectedProcedure
    .input(routes.countNameUsageQuery.inputValidation)
    .query(routes.countNameUsageQuery.execute)
})
