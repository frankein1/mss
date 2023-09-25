import {
  createViewUrlHandler,
  deleteDocumentHandler,
  editDocumentHandler
} from '../controller/document'
import {
  editDocumentSchema,
  createViewUrlSchema,
  deleteDocumentSchema
} from '../../schema/document.schema'
import { protectedProcedure, router } from '..'

export const documentRouter = router({
  edit: protectedProcedure
    .input(editDocumentSchema)
    .mutation(editDocumentHandler),
  createViewUrl: protectedProcedure
    .input(createViewUrlSchema)
    .mutation(createViewUrlHandler),
  delete: protectedProcedure
    .input(deleteDocumentSchema)
    .mutation(deleteDocumentHandler)
})
