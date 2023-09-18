import { idSchema } from '~/server/schema'
import { getDraftHandler, deleteDraftHandler } from '~/server/controller/draft'
import { protectedProcedure, router } from '~/server/trpc'

export const draftRouter = router({
  get: protectedProcedure.input(idSchema).query(getDraftHandler),
  delete: protectedProcedure.input(idSchema).mutation(deleteDraftHandler)
})
