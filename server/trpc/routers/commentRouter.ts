import { router, protectedProcedure } from '~/server/trpc'
import { addCommentMutation } from '~/server/route/comment'

export const commentRouter = router({
  add: protectedProcedure
    .input(addCommentMutation.inputValidation)
    .mutation(addCommentMutation.execute)
})
