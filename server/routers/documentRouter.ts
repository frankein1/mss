import {
  addDocumentHandler,
  createUploadUrlHandler,
  createViewUrlHandler,
  deleteDocumentHandler,
  editDocumentHandler
} from '../controller/document.controller'
import {
  addDocumentSchema,
  editDocumentSchema,
  createUploadUrlSchema,
  createViewUrlSchema,
  deleteDocumentSchema
} from '../schema/document.schema'
import { protectedProcedure, router } from '../trpc'

export const documentRouter = router({
  add: protectedProcedure.input(addDocumentSchema).mutation(addDocumentHandler),
  edit: protectedProcedure
    .input(editDocumentSchema)
    .mutation(editDocumentHandler),
  createUploadUrl: protectedProcedure
    .input(createUploadUrlSchema)
    .mutation(createUploadUrlHandler),
  createViewUrl: protectedProcedure
    .input(createViewUrlSchema)
    .mutation(createViewUrlHandler),
  delete: protectedProcedure
    .input(deleteDocumentSchema)
    .mutation(deleteDocumentHandler)
})
