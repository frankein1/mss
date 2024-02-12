import { DocumentType } from '@prisma/client'
import { z } from 'zod'
import { File } from 'node-fetch-native'
import { stringConstraint, requiredNativeEnum } from './helpers.schema'
import { documentFileMaxSize, documentFileAllowedTypes } from '~/client/options'
import {
  errorMessages,
  maxStringLengthMessage,
  minStringLengthMessage,
  requiredErrorMessage
} from '~/utils/zod'
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

export const uploadBrowserDocumentSchema = z.object({
  beneficiaryId: z.string(errorMessages).uuid(),
  type: requiredNativeEnum(DocumentType),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false),
  file: z.instanceof(File, { message: requiredErrorMessage })
})

export const addDocumentSchema = z.object({
  beneficiaryId: z.string(errorMessages).uuid(),
  type: requiredNativeEnum(DocumentType),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false),
  file: z.object({
    name: z.string(),
    mimeType: documentMimeTypeValidation,
    size: documentSizeValidation
  })
})

export const deleteDocumentSchema = z.object({
  documentKey: z.string()
})

export const editDocumentSchema = z.object({
  key: z.string(),
  name: stringConstraint
    .min(2, minStringLengthMessage(2))
    .max(150, maxStringLengthMessage(150)),
  beneficiaryId: z.string(errorMessages).uuid(),
  type: requiredNativeEnum(DocumentType),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false)
})

export const createUploadUrlSchema = z.object({
  name: stringConstraint.max(150, maxStringLengthMessage(150)),
  mimeType: stringConstraint.max(50, maxStringLengthMessage(50)),
  beneficiaryId: z.string().uuid()
})

export const createViewUrlSchema = z.object({ key: z.string() })

type AddDocumentInput = z.infer<typeof addDocumentSchema>
type UploadBrowserDocumentInput = z.infer<typeof uploadBrowserDocumentSchema>
type EditDocumentInput = z.infer<typeof editDocumentSchema>
type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>
type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>
type CreateViewUrlInput = z.infer<typeof createViewUrlSchema>

export type {
  AddDocumentInput,
  EditDocumentInput,
  DeleteDocumentInput,
  CreateUploadUrlInput,
  CreateViewUrlInput,
  UploadBrowserDocumentInput
}
export const getDocumentKeySchema = z.object({
  key: z.string().uuid()
})

export type GetDocumentKeyInput = z.infer<typeof getDocumentKeySchema>
