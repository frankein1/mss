import { FollowupMedium, FollowupStatus } from '@prisma/client'
import { z } from 'zod'
import { errorMessages } from '~/utils/zod'

const addFollowupSchema = z.object({
  beneficiaryId: z.string().uuid(),
  types: z
    .array(z.string().uuid(), {
      ...errorMessages,
      required_error: "Veuillez renseigner au moins un type d'accompagnement"
    })
    .min(1, "Veuillez renseigner au moins un type d'accompagnement"),
  documents: z.array(z.string(), errorMessages).default([]),
  medium: z.nativeEnum(FollowupMedium, errorMessages),
  date: z.date(errorMessages),
  synthesis: z.string().nullish(),
  privateSynthesis: z.string().nullish(),
  status: z.nativeEnum(FollowupStatus, errorMessages),
  helpRequested: z.boolean().default(false),
  place: z.string().nullish(),
  redirected: z.boolean().default(false),
  structureName: z.string().nullish(),
  dueDate: z.date(errorMessages).nullish(),
  thirdPersonName: z.string().nullish()
})

const editFollowupSchema = addFollowupSchema.extend({
  followupId: z.string().uuid()
})

type AddFollowupInput = z.infer<typeof addFollowupSchema>
type EditFollowupInput = z.infer<typeof editFollowupSchema>

export { addFollowupSchema, editFollowupSchema }

export type { AddFollowupInput, EditFollowupInput }
