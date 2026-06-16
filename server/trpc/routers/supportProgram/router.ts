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
    .query(routes.getSupportProgramNamesForFamilyFileQuery.execute)
})
