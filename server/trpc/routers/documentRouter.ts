import { protectedProcedure, router } from '..'
import {
  createDocumentMutation,
  deleteDocumentMutation,
  editDocumentMutation,
  getSignedUrlQuery,
  getUploadPresignedUrlQuery
} from '~/server/route/document'

export const documentRouter = router({
  create: protectedProcedure
    .input(createDocumentMutation.inputValidation)
    .mutation(createDocumentMutation.execute),
  edit: protectedProcedure
    .input(editDocumentMutation.inputValidation)
    .mutation(editDocumentMutation.execute),
  delete: protectedProcedure
    .input(deleteDocumentMutation.inputValidation)
    .mutation(deleteDocumentMutation.execute),
  getSignedUrl: protectedProcedure
    .input(getSignedUrlQuery.inputValidation)
    .query(getSignedUrlQuery.execute),
  getUploadPresignedUrl: protectedProcedure
    .input(getUploadPresignedUrlQuery.inputValidation)
    .query(getUploadPresignedUrlQuery.execute)
})
