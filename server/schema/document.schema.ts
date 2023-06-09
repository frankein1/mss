import { DocumentType } from '@prisma/client'
import { z } from 'zod'
import {
  documentFileMaxSize,
  documentFileAllowedTypes
} from '~/client/options/document'
import { errorMessages } from '~/utils/zod'
import { formatByteSize } from '~/utils/formatByteSize'

const documentSizeValidationErrorMessage = `La taille du document doit être inférieure à ${formatByteSize(
  documentFileMaxSize
)}`

export const documentMimeTypeValidation = z
  .string()
  .refine(value => documentFileAllowedTypes.includes(value))

export const documentSizeValidation = z
  .number()
  .int()
  .max(documentFileMaxSize, documentSizeValidationErrorMessage)

export const addDocumentSchema = z.object({
  beneficiaryId: z.string(errorMessages),
  name: z.string(),
  type: z.nativeEnum(DocumentType, {
    ...errorMessages,
    required_error: 'Veuillez renseigner le type du document'
  }),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false),
  file: z.object({
    key: z.string({ required_error: 'Veuillez téléverser un document' }),
    mimeType: documentMimeTypeValidation,
    filenameDownload: z.string(),
    size: documentSizeValidation
  })
})

export const deleteDocumentSchema = z.object({
  documentKey: z.string()
})

export const editDocumentSchema = addDocumentSchema
  .omit({ file: true })
  .extend({
    key: z.string()
  })

export const createUploadUrlSchema = z.object({
  name: z.string(),
  mimeType: z.string(),
  beneficiaryId: z.string()
})

export const createViewUrlSchema = z.object({ key: z.string() })

type AddDocumentInput = z.infer<typeof addDocumentSchema>
type EditDocumentInput = z.infer<typeof editDocumentSchema>
type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>
type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>
type CreateViewUrlInput = z.infer<typeof createViewUrlSchema>

export type {
  AddDocumentInput,
  EditDocumentInput,
  DeleteDocumentInput,
  CreateUploadUrlInput,
  CreateViewUrlInput
}
export const getDocumentKeySchema = z.object({
  key: z.string().uuid()
})

export type GetDocumentKeyInput = z.infer<typeof getDocumentKeySchema>
