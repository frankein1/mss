import { addFollowupHandler } from '../controller/followup.controller'
import { addFollowupSchema } from '~/server/schema'
import { protectedProcedure, router } from '~/server/trpc'

export const followupRouter = router({
  add: protectedProcedure.input(addFollowupSchema).mutation(addFollowupHandler)
})
