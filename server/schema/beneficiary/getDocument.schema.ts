import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { optionalPaginatedSchema } from '../helpers.schema'
import { beneficiaryDocumentFilterSchema } from '../filter.schema'

export const getDocumentsSchema = z
  .object({
    familyFileId: z.string().uuid(),
    filters: beneficiaryDocumentFilterSchema.optional(),
    orderBy: z
      .object({
        name: z.nativeEnum(Prisma.SortOrder).optional(),
        created: z.nativeEnum(Prisma.SortOrder).optional()
      })
      .optional()
  })
  .merge(optionalPaginatedSchema)

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>
