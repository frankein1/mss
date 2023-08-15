import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const adminGetStructuresSchema = z.object({
  orderBy: z.array(
    z.object({
      beneficiaries: z
        .object({
          _count: z.nativeEnum(Prisma.SortOrder).optional()
        })
        .optional()
    })
  ),
  search: z.string().nullish()
})

export type AdminGetStructuresInput = z.infer<typeof adminGetStructuresSchema>
