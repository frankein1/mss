import {
  FollowupMedium,
  FollowupStatus,
  Minister,
  Prisma,
  FollowupIntervention,
  FollowupSignalement
} from '@prisma/client'
import { z } from 'zod'
import { errorMessages } from '~/utils/zod'
import { followupFilterSchema } from '~/server/schema'

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
  ministre: z.nativeEnum(Minister, errorMessages).nullish(),
  date: z.coerce.date(errorMessages),
  synthesis: z.string().nullish(),
  privateSynthesis: z.string().nullish(),
  status: z.nativeEnum(FollowupStatus, errorMessages),
  helpRequested: z.boolean().default(false),
  place: z.string().nullish(),
  redirected: z.boolean().default(false),
  structureName: z.string().nullish(),
  dueDate: z.coerce.date(errorMessages).nullish(),
  thirdPersonName: z.string().nullish(),
  firstFollowup: z.boolean().default(false),
  numeroPegase: z.string().nullish(),
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

const editFollowupSchema = addFollowupSchema.extend({
  id: z.string().uuid()
})

type AddFollowupInput = z.infer<typeof addFollowupSchema>
type EditFollowupInput = z.infer<typeof editFollowupSchema>

const getFollowupsSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  orderBy: z.array(
    z.object({
      date: z.nativeEnum(Prisma.SortOrder).optional(),
      dueDate: z.nativeEnum(Prisma.SortOrder).optional(),
      beneficiary: z
        .object({
          usualName: z.nativeEnum(Prisma.SortOrder).optional()
        })
        .optional()
    })
  ),
  filters: followupFilterSchema
})

type GetFollowupsInput = z.infer<typeof getFollowupsSchema>

const quickEditFollowupSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(FollowupStatus)
})

type QuickEditFollowupInput = z.infer<typeof quickEditFollowupSchema>

export {
  addFollowupSchema,
  editFollowupSchema,
  getFollowupsSchema,
  quickEditFollowupSchema
}

export type {
  AddFollowupInput,
  EditFollowupInput,
  GetFollowupsInput,
  QuickEditFollowupInput
}
