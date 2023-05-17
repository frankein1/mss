import {
  getHelpRequestsHandler,
  updateHelpRequestHandler
} from '~/server/controller/helpRequest.controller'
import { getHelpRequestsSchema, editHelpRequestSchema } from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const helpRequestRouter = router({
  getHelpRequests: protectedProcedure
    .input(getHelpRequestsSchema)
    .query(getHelpRequestsHandler),
  update: protectedProcedure
    .input(editHelpRequestSchema)
    .mutation(updateHelpRequestHandler)
})
