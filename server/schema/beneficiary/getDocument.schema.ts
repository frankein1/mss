import { Prisma } from '@prisma/client'
import { z } from 'zod/v4'
import { optionalPaginatedSchema } from '../helpers.schema'
import { beneficiaryDocumentFilterSchema } from '../filter.schema'

export const getDocumentsSchema = z
  .object({
    familyFileId: z.uuid(),
    filters: beneficiaryDocumentFilterSchema.optional(),
    orderBy: z
      .object({
        name: z.enum(Prisma.SortOrder).optional(),
        created: z.enum(Prisma.SortOrder).optional()
      })
      .optional()
  })
  .extend(optionalPaginatedSchema.shape)

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>
