import { protectedProcedure, router } from '../../trpc'
import {
  deleteDocumentMutation,
  editDocumentMutation
} from '~~/server/route/document'

export const documentRouter = router({
  edit: protectedProcedure
    .input(editDocumentMutation.inputValidation)
    .mutation(editDocumentMutation.execute),
  delete: protectedProcedure
    .input(deleteDocumentMutation.inputValidation)
    .mutation(deleteDocumentMutation.execute)
})
