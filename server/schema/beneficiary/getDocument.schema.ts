import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { optionalPaginatedSchema } from '../helpers.schema'
import { beneficiaryDocumentFilterSchema } from '~/server/schema'

export const getDocumentsSchema = z
  .object({
    beneficiaryId: z.string(),
    filters: beneficiaryDocumentFilterSchema.optional(),
    orderBy: z
      .array(
        z.object({
          name: z.nativeEnum(Prisma.SortOrder).optional(),
          created: z.nativeEnum(Prisma.SortOrder).optional()
        })
      )
      .optional()
  })
  .merge(optionalPaginatedSchema)

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>
