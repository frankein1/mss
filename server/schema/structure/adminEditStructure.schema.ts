import { StructureType } from '@prisma/client'
import { z } from 'zod'
import {
  requiredNativeEnum,
  stringConstraint,
  siretConstraint,
  stringOrEmpty
} from '../helpers.schema'
import { editStructureSchema } from './editStructure.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const adminEditStructureSchemaBase = editStructureSchema
  .omit({
    socialSupportSubjects: true
  })
  .extend({
    type: requiredNativeEnum(StructureType),
    inhabitantsNumber: stringConstraint
      .max(50, maxStringLengthMessage(50))
      .nullish(),
    inseeCode: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
    siret: stringOrEmpty(siretConstraint)
  })

export const adminEditStructureSchema = adminEditStructureSchemaBase

export type AdminEditStructureInput = z.infer<typeof adminEditStructureSchema>
