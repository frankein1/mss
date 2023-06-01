import { DocumentType } from '@prisma/client'
import { z } from 'zod'
import {
  documentFileMaxSize,
  DocumentTags,
  documentFileAllowedTypes
} from '~/client/options/document'
import { errorMessages } from '~/utils/zod'
import { formatByteSize } from '~/utils/formatByteSize'

// const documentMimeTypeValidationErrorMessage =
//   "Ce type de document n'est pas accepté"

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
  type: z.nativeEnum(DocumentType, {
    ...errorMessages,
    required_error: 'Veuillez renseigner le type du document'
  }),
  tags: z.array(z.enum(DocumentTags)),
  confidential: z.boolean().default(false),
  file: z.object({
    key: z.string({ required_error: 'Veuillez téléverser un document' }),
    mimeType: documentMimeTypeValidation,
    name: z.string(),
    size: documentSizeValidation
  })
})

export type AddDocumentInput = z.infer<typeof addDocumentSchema>
