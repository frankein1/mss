import { z } from 'zod'
import { DefaultFollowupType } from '@prisma/client'
import { minStringLengthMessage } from '~/utils/zod'

const createFollowupTypeSchema = z.object({
  name: z
    .string({
      invalid_type_error:
        "Veuillez renseigner le nom du type d'accompagnement.",
      required_error: "Veuillez renseigner le nom du type d'accompagnement."
    })
    .trim()
    .min(2, minStringLengthMessage(2)),
  legallyRequired: z.boolean(),
  default: z.nativeEnum(DefaultFollowupType).nullish(),
  ownedByStructureId: z.string().uuid()
})

const createCustomFollowupTypeSchema = createFollowupTypeSchema.pick({
  name: true
})

type CreateFollowupTypeInput = z.infer<typeof createFollowupTypeSchema>
type CreateCustomFollowupTypeInput = z.infer<
  typeof createCustomFollowupTypeSchema
>

export { createFollowupTypeSchema, createCustomFollowupTypeSchema }

export type { CreateFollowupTypeInput, CreateCustomFollowupTypeInput }
