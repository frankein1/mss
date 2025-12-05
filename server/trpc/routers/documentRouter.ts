import { protectedProcedure, router } from '..'
import {
  createViewUrlMutation,
  deleteDocumentMutation,
  editDocumentMutation,
  prepareUpload
} from '~/server/route/document'

export const documentRouter = router({
  edit: protectedProcedure
    .input(editDocumentMutation.inputValidation)
    .mutation(editDocumentMutation.execute),
  createViewUrl: protectedProcedure
    .input(createViewUrlMutation.inputValidation)
    .mutation(createViewUrlMutation.execute),
  delete: protectedProcedure
    .input(deleteDocumentMutation.inputValidation)
    .mutation(deleteDocumentMutation.execute),
  prepareUpload: protectedProcedure
    .input(prepareUpload.inputValidation)
    .mutation(prepareUpload.execute)
})
