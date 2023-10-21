import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const adminGetStructuresSchema = z.object({
  orderBy: z.array(
    z.object({
      beneficiaries: z
        .object({
          _count: z.nativeEnum(Prisma.SortOrder).optional()
        })
        .optional(),
      lastActivity: z.nativeEnum(Prisma.SortOrder).optional()
    })
  ),
  search: stringConstraint.max(50, maxStringLengthMessage(50)).nullish()
})

export type AdminGetStructuresInput = z.infer<typeof adminGetStructuresSchema>
