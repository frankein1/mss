import { protectedProcedure, router } from '..'
import {
  deleteDocumentMutation,
  editDocumentMutation,
  getSignedUrlQuery
} from '~/server/route/document'

export const documentRouter = router({
  edit: protectedProcedure
    .input(editDocumentMutation.inputValidation)
    .mutation(editDocumentMutation.execute),
  delete: protectedProcedure
    .input(deleteDocumentMutation.inputValidation)
    .mutation(deleteDocumentMutation.execute),
  getSignedUrl: protectedProcedure
    .input(getSignedUrlQuery.inputValidation)
    .query(getSignedUrlQuery.execute)
})
