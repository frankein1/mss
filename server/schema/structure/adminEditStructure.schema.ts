import { StructureType, DefaultSocialSupportSubject } from '@prisma/client'
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
  .extend({
    legallyRequiredSocialSupportSubjects: z.array(
      z.nativeEnum(DefaultSocialSupportSubject)
    ),
    legallyNotRequiredSocialSupportSubjects: z.array(
      z.union([
        z.string().uuid(),
        z.nativeEnum(DefaultSocialSupportSubject),
        z.string()
      ])
    )
  })
  .refine(
    val =>
      val.legallyRequiredSocialSupportSubjects.length ||
      val.legallyNotRequiredSocialSupportSubjects.length,
    {
      message: 'Veuillez sélectionner au moins une aide légale ou facultative.',
      path: ['legallyRequiredSocialSupportSubjects']
    }
  )
  .refine(
    val =>
      val.legallyRequiredSocialSupportSubjects.length ||
      val.legallyNotRequiredSocialSupportSubjects.length,
    {
      message: 'Veuillez sélectionner au moins une aide légale ou facultative.',
      path: ['legallyNotRequiredSocialSupportSubjects']
    }
  )

export type AdminEditStructureInput = z.infer<typeof adminEditStructureSchema>
