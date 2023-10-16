import {
  FollowupMedium,
  FollowupStatus,
  Minister,
  FollowupIntervention,
  FollowupSignalement
} from '@prisma/client'
import { z } from 'zod'

import {
  requiredNativeEnum,
  withEmptyValueOptionalNativeEnum,
  stringConstraint,
  numeroPegaseContraint
} from '../helpers.schema'
import { errorMessages, maxStringLengthMessage } from '~/utils/zod'

export const addFollowupSchema = z.object({
  beneficiaryId: z.string().uuid(),
  types: z
    .array(z.string().uuid(), {
      ...errorMessages,
      required_error: "Veuillez renseigner au moins un type d'accompagnement"
    })
    .min(1, "Veuillez renseigner au moins un type d'accompagnement"),
  documents: z.array(z.string(), errorMessages).default([]),
  medium: requiredNativeEnum(FollowupMedium),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  date: z.coerce.date(errorMessages),
  synthesis: stringConstraint.max(6000, maxStringLengthMessage(6000)).nullish(),
  privateSynthesis: stringConstraint
    .max(1000, maxStringLengthMessage(1000))
    .nullish(),
  status: requiredNativeEnum(FollowupStatus),
  helpRequested: z.boolean().default(false),
  place: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  redirected: z.boolean().default(false),
  structureName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  dueDate: z.coerce.date().nullish(),
  thirdPersonName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  firstFollowup: z.boolean().default(false),
  numeroPegase: numeroPegaseContraint.nullish(),
  prescribingOrganizationId: z.string().nullish(),
  classified: z.boolean().default(false),
  forwardedToJustice: z.boolean().default(false),
  [FollowupIntervention.DeetsSiao]: z.boolean().default(false),
  [FollowupIntervention.Prefecture]: z.boolean().default(false),
  [FollowupIntervention.Bailleur]: z.boolean().default(false),
  [FollowupIntervention.ActionLogement]: z.boolean().default(false),
  [FollowupIntervention.SecoursMedecinTraitant]: z.boolean().default(false),
  [FollowupSignalement.ChefCabinet]: z.boolean().default(false),
  [FollowupSignalement.Prefet]: z.boolean().default(false),
  [FollowupSignalement.OrganismeMenace]: z.boolean().default(false)
})

export type AddFollowupInput = z.infer<typeof addFollowupSchema>
