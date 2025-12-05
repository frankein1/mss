import { DocumentType } from '@prisma/client'
import { z } from 'zod'
import { File } from 'node-fetch-native'
import {
  stringConstraint,
  requiredNativeEnum,
  limitedStringConstraint
} from './helpers.schema'
import { documentFileMaxSize, documentFileAllowedTypes } from '~/client/options'
import {
  errorMessages,
  maxStringLengthMessage,
  minStringLengthMessage,
  requiredErrorMessage
} from '~/utils/zod'
import { formatByteSize } from '~/utils/formatByteSize'
import { MAX_UPLOAD_SIZE_BYTES } from '~/utils/constants'

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
  familyFileId: z.string(errorMessages).uuid(),
  beneficiaryId: z.string(errorMessages).uuid(),
  type: requiredNativeEnum(DocumentType),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false),
  file: z.instanceof(File, { message: requiredErrorMessage }).refine(
    // ajout taille minimale
    file => file.size <= MAX_UPLOAD_SIZE_BYTES,
    documentSizeValidationErrorMessage
    // ajout validation du mime type dans le frontend
  )
})

export const addDocumentSchema = z.object({
  familyFileId: z.string(errorMessages).uuid(),
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

export const prepareUploadSchema = z.object({
  familyFileId: z.string(errorMessages).uuid(),
  beneficiaryId: z.string(errorMessages).uuid(),
  type: requiredNativeEnum(DocumentType),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false),
  file: z.object({
    name: limitedStringConstraint(0, 200),
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

type AddDocumentInput = z.infer<typeof addDocumentSchema>
type PrepareUploadInput = z.infer<typeof prepareUploadSchema>
type UploadBrowserDocumentInput = z.infer<typeof uploadBrowserDocumentSchema>
type EditDocumentInput = z.infer<typeof editDocumentSchema>
type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>
type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>

export type {
  AddDocumentInput,
  PrepareUploadInput,
  EditDocumentInput,
  DeleteDocumentInput,
  CreateUploadUrlInput,
  UploadBrowserDocumentInput
}
export const getDocumentKeySchema = z.object({
  key: z.string().uuid()
})

export type GetDocumentKeyInput = z.infer<typeof getDocumentKeySchema>
