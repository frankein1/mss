import {
  addFollowupHandler,
  exportFollowupsHandler,
  getFollowupsHandler,
  getFollowupDetailsHandler,
  quickUpdateFollowupHandler,
  updateFollowupHandler,
  deleteFollowupHandler
} from '~/server/trpc/controller/followup'
import {
  addFollowupSchema,
  getFollowupsSchema,
  idSchema,
  editFollowupSchema,
  quickEditFollowupSchema,
  exportFollowupsSchema
} from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const followupRouter = router({
  add: protectedProcedure.input(addFollowupSchema).mutation(addFollowupHandler),
  getFollowups: protectedProcedure
    .input(getFollowupsSchema)
    .query(getFollowupsHandler),
  exportFollowups: protectedProcedure
    .input(exportFollowupsSchema)
    .query(exportFollowupsHandler),
  quickUpdate: protectedProcedure
    .input(quickEditFollowupSchema)
    .mutation(quickUpdateFollowupHandler),
  update: protectedProcedure
    .input(editFollowupSchema)
    .mutation(updateFollowupHandler),
  getFollowupDetails: protectedProcedure
    .input(idSchema)
    .query(getFollowupDetailsHandler),
  delete: protectedProcedure.input(idSchema).mutation(deleteFollowupHandler)
})
