import { z } from 'zod'
import { DefaultSocialSupportSubject } from '@prisma/client'
import { editStructureSchema } from './editStructure.schema'

export const editCurrentUserStructureSchema = editStructureSchema
  .omit({
    structureId: true,
    socialSupportSubjects: true
  })
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

export type EditCurrentUserStructureInput = z.infer<
  typeof editCurrentUserStructureSchema
>
