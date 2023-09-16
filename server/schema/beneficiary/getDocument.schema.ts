import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { beneficiaryDocumentFilterSchema } from '~/server/schema'

export const getDocumentsSchema = z
  .object({
    beneficiaryId: z.string(),
    filters: beneficiaryDocumentFilterSchema,
    orderBy: z.array(
      z.object({
        name: z.nativeEnum(Prisma.SortOrder).optional(),
        created: z.nativeEnum(Prisma.SortOrder).optional()
      })
    )
  })
  .merge(paginatedSchema)

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>
