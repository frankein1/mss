import {
  addFollowupHandler,
  getFollowupsHandler,
  getFollowupDetailsHandler,
  updateFollowupStatusHandler,
  updateFollowupHandler
} from '~/server/controller/followup'
import {
  addFollowupSchema,
  getFollowupsSchema,
  idSchema,
  editFollowupSchema,
  editFollowupStatusSchema
} from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const followupRouter = router({
  add: protectedProcedure.input(addFollowupSchema).mutation(addFollowupHandler),
  getFollowups: protectedProcedure
    .input(getFollowupsSchema)
    .query(getFollowupsHandler),
  updateStatus: protectedProcedure
    .input(editFollowupStatusSchema)
    .mutation(updateFollowupStatusHandler),
  update: protectedProcedure
    .input(editFollowupSchema)
    .mutation(updateFollowupHandler),
  getFollowupDetails: protectedProcedure
    .input(idSchema)
    .query(getFollowupDetailsHandler)
})
