import { z } from 'zod'

export const getDocumentsSchema = z.object({
  beneficiaryId: z.string()
})

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>
