import { router, protectedProcedure } from '~/server/trpc'
import {
  addCommentMutation,
  deleteCommentMutation,
  editCommentMutation
} from '~/server/route/comment'

export const commentRouter = router({
  add: protectedProcedure
    .input(addCommentMutation.inputValidation)
    .mutation(addCommentMutation.execute),
  edit: protectedProcedure
    .input(editCommentMutation.inputValidation)
    .mutation(editCommentMutation.execute),
  delete: protectedProcedure
    .input(deleteCommentMutation.inputValidation)
    .mutation(deleteCommentMutation.execute)
})
