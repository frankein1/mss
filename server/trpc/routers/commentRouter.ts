import { router, protectedProcedure } from '~/server/trpc'
import { addCommentMutation } from '~/server/request/comment'

export const commentRouter = router({
  add: protectedProcedure
    .input(addCommentMutation.inputValidation)
    .mutation(addCommentMutation.execute)
})
