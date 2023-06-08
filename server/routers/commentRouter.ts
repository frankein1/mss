import { router, protectedProcedure } from '~/server/trpc'
import { addCommentSchema } from '~/server/schema'
import { addCommentHandler } from '~/server/controller/comment.controller'

export const commentRouter = router({
  add: protectedProcedure.input(addCommentSchema).mutation(addCommentHandler)
})
