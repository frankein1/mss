import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { helpRequestFilterSchema } from '../filter.schema'

export const exportHelpRequestsSchema = z.object({
  orderBy: z.array(
    z.object({
      date: z.nativeEnum(Prisma.SortOrder).optional(),
      dueDate: z.nativeEnum(Prisma.SortOrder).optional(),
      beneficiary: z
        .object({
          usualName: z.nativeEnum(Prisma.SortOrder).optional()
        })
        .optional(),
      instructorOrganization: z
        .object({
          name: z.nativeEnum(Prisma.SortOrder).optional()
        })
        .optional()
    })
  ),
  filters: helpRequestFilterSchema
})

export type ExportHelpRequestsInput = z.infer<typeof exportHelpRequestsSchema>
