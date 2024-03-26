import { Prisma, StructureType } from '@prisma/client'
import { z } from 'zod'
import {
  requiredNativeEnum,
  stringConstraint,
  siretConstraint,
  stringOrEmpty
} from '../helpers.schema'
import { createStructureSchema } from './structure.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const adminEditStructureSchema = createStructureSchema
  .omit({ type: true })
  .extend({
    id: z.string().uuid(),
    type: requiredNativeEnum(StructureType),
    inhabitantsNumber: stringConstraint
      .max(50, maxStringLengthMessage(50))
      .nullish(),
    inseeCode: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
    siret: stringOrEmpty(siretConstraint)
  })

export type AdminEditStructureInput = z.infer<typeof adminEditStructureSchema>

export const adminCreateStructureSchema = adminEditStructureSchema.omit({
  id: true
})

export type AdminCreateStructureInput = z.infer<
  typeof adminCreateStructureSchema
>

export const adminGetStructuresSchema = z
  .object({
    orderBy: z
      .object({
        beneficiaries: z
          .object({
            _count: z.nativeEnum(Prisma.SortOrder).optional()
          })
          .optional(),
        lastActivity: z.nativeEnum(Prisma.SortOrder).optional()
      })
      .optional(),
    search: stringConstraint.max(50, maxStringLengthMessage(50)).nullish()
  })
  .optional()

export type AdminGetStructuresInput = z.infer<typeof adminGetStructuresSchema>
