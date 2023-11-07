import {
  getFollowupDetailsQuery,
  deleteFollowupMutation,
  createFollowupMutation,
  getFollowupsQuery,
  exportFollowupsQuery,
  quickUpdateFollowupMutation,
  updateFollowupMutation
} from '~/server/route/followup'

import { protectedProcedure, router } from '~/server/trpc'

export const followupRouter = router({
  add: protectedProcedure
    .input(createFollowupMutation.inputValidation)
    .mutation(createFollowupMutation.execute),
  getFollowups: protectedProcedure
    .input(getFollowupsQuery.inputValidation)
    .query(getFollowupsQuery.execute),
  exportFollowups: protectedProcedure
    .input(exportFollowupsQuery.inputValidation)
    .query(exportFollowupsQuery.execute),
  quickUpdate: protectedProcedure
    .input(quickUpdateFollowupMutation.inputValidation)
    .mutation(quickUpdateFollowupMutation.execute),
  update: protectedProcedure
    .input(updateFollowupMutation.inputValidation)
    .mutation(updateFollowupMutation.execute),
  getFollowupDetails: protectedProcedure
    .input(getFollowupDetailsQuery.inputValidation)
    .query(getFollowupDetailsQuery.execute),
  delete: protectedProcedure
    .input(deleteFollowupMutation.inputValidation)
    .mutation(deleteFollowupMutation.execute),
})
