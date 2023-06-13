import {
  addHelpRequestHandler,
  getHelpRequestsHandler,
  getHelpRequestDetailsHandler,
  quickUpdateHelpRequestHandler,
  updateHelpRequestHandler,
  deleteHelpRequestHandler
} from '~/server/controller/helpRequest'
import {
  createHelpRequestSchema,
  getHelpRequestsSchema,
  quickEditHelpRequestSchema,
  editHelpRequestSchema,
  idSchema
} from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const helpRequestRouter = router({
  add: protectedProcedure
    .input(createHelpRequestSchema)
    .mutation(addHelpRequestHandler),
  getHelpRequests: protectedProcedure
    .input(getHelpRequestsSchema)
    .query(getHelpRequestsHandler),
  getHelpRequestDetails: protectedProcedure
    .input(idSchema)
    .query(getHelpRequestDetailsHandler),
  quickUpdate: protectedProcedure
    .input(quickEditHelpRequestSchema)
    .mutation(quickUpdateHelpRequestHandler),
  update: protectedProcedure
    .input(editHelpRequestSchema)
    .mutation(updateHelpRequestHandler),
  delete: protectedProcedure.input(idSchema).mutation(deleteHelpRequestHandler)
})
