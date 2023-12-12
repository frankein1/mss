import {
  createHelpRequestMutation,
  deleteHelpRequestMutation,
  exportHelpRequestQuery,
  getHelpRequestDetailsQuery,
  getHelpRequestsQuery,
  quickUpdateHelpRequestMutation,
  updateHelpRequestMutation
} from '~/server/route/helpRequest'
import { protectedProcedure, router } from '~/server/trpc'

export const helpRequestRouter = router({
  add: protectedProcedure
    .input(createHelpRequestMutation.inputValidation)
    .mutation(createHelpRequestMutation.execute),
  getHelpRequests: protectedProcedure
    .input(getHelpRequestsQuery.inputValidation)
    .query(getHelpRequestsQuery.execute),
  exportHelpRequests: protectedProcedure
    .input(exportHelpRequestQuery.inputValidation)
    .query(exportHelpRequestQuery.execute),
  getHelpRequestDetails: protectedProcedure
    .input(getHelpRequestDetailsQuery.inputValidation)
    .query(getHelpRequestDetailsQuery.execute),
  quickUpdate: protectedProcedure
    .input(quickUpdateHelpRequestMutation.inputValidation)
    .mutation(quickUpdateHelpRequestMutation.execute),
  update: protectedProcedure
    .input(updateHelpRequestMutation.inputValidation)
    .mutation(updateHelpRequestMutation.execute),
  delete: protectedProcedure
    .input(deleteHelpRequestMutation.inputValidation)
    .mutation(deleteHelpRequestMutation.execute)
})
