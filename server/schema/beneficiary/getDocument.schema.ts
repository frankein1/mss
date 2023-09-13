import { z } from 'zod'
import { beneficiaryDocumentFilterSchema } from '~/server/schema'

export const getDocumentsSchema = z.object({
  beneficiaryId: z.string(),
  filters: beneficiaryDocumentFilterSchema
})

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>
