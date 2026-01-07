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
    file => file.size <= documentFileMaxSize,
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

/** Create document in DB after upload via presigned url to S3 */
export const createDocumentSchema = z.object({
  familyFileId: z.string(errorMessages).uuid(),
  beneficiaryId: z.string(errorMessages).uuid(),
  type: requiredNativeEnum(DocumentType),
  tags: z.array(z.string()),
  confidential: z.boolean().default(false),
  filename: limitedStringConstraint(1, 1000),
  filepath: limitedStringConstraint(1, 2000),
  file: z.object({
    name: z.string(),
    mimeType: documentMimeTypeValidation,
    size: documentSizeValidation
  })
})

export const validateUploadSchema = z.object({
  key: z.string().uuid()
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

export const getSignedUrlSchema = z.object({ key: z.string() })
export const getUploadPresignedUrlSchema = z.object({
  beneficiaryId: z.string(errorMessages).uuid(),
  file: z.object({
    name: z.string(),
    mimeType: documentMimeTypeValidation,
    size: documentSizeValidation
  })
})

type AddDocumentInput = z.infer<typeof addDocumentSchema>
type CreateDocumentInput = z.infer<typeof createDocumentSchema>
type ValidateUploadInput = z.infer<typeof validateUploadSchema>
type UploadBrowserDocumentInput = z.infer<typeof uploadBrowserDocumentSchema>
type EditDocumentInput = z.infer<typeof editDocumentSchema>
type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>
type GetSignedUrlInput = z.infer<typeof getSignedUrlSchema>
type GetUploadPresignedUrlInput = z.infer<typeof getUploadPresignedUrlSchema>

export type {
  AddDocumentInput,
  CreateDocumentInput,
  ValidateUploadInput,
  EditDocumentInput,
  DeleteDocumentInput,
  GetSignedUrlInput,
  GetUploadPresignedUrlInput,
  UploadBrowserDocumentInput
}
export const getDocumentKeySchema = z.object({
  key: z.string().uuid()
})

export type GetDocumentKeyInput = z.infer<typeof getDocumentKeySchema>
