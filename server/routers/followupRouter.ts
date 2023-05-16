import {
  addFollowupHandler,
  getFollowupsHandler,
  updateFollowupHandler
} from '../controller/followup.controller'
import {
  addFollowupSchema,
  getFollowupsSchema,
  editFollowupStatusSchema
} from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const followupRouter = router({
  add: protectedProcedure.input(addFollowupSchema).mutation(addFollowupHandler),
  getFollowups: protectedProcedure
    .input(getFollowupsSchema)
    .query(getFollowupsHandler),
  update: protectedProcedure
    .input(editFollowupStatusSchema)
    .mutation(updateFollowupHandler)
})
