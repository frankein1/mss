import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { wordConstraint } from '~/utils/zod'

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
  search: wordConstraint().nullish()
})

export type AdminGetStructuresInput = z.infer<typeof adminGetStructuresSchema>
