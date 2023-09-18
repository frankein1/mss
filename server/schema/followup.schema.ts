import {
  FollowupMedium,
  FollowupStatus,
  Minister,
  Prisma,
  FollowupIntervention,
  FollowupSignalement
} from '@prisma/client'
import { z } from 'zod'
import { paginatedSchema } from './helpers.schema'
import { followupFilterSchema } from './filter.schema'
import {
  errorMessages,
  requiredNativeEnum,
  withEmptyValueOptionalNativeEnum,
  wordConstraint,
  numeroPegaseContraint
} from '~/utils/zod'

const addFollowupSchema = z.object({
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
  synthesis: wordConstraint().nullish(),
  privateSynthesis: wordConstraint().nullish(),
  status: requiredNativeEnum(FollowupStatus),
  helpRequested: z.boolean().default(false),
  place: wordConstraint().nullish(),
  redirected: z.boolean().default(false),
  structureName: wordConstraint().nullish(),
  dueDate: z.coerce.date(errorMessages).nullish(),
  thirdPersonName: wordConstraint().nullish(),
  firstFollowup: z.boolean().default(false),
  numeroPegase: numeroPegaseContraint.nullish(),
  prescribingOrganizationId: z.string().uuid().nullish(),
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

const exportFollowupsSchema = z.object({
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

type ExportFollowupsInput = z.infer<typeof exportFollowupsSchema>

const getFollowupsSchema = exportFollowupsSchema.merge(paginatedSchema)

type GetFollowupsInput = z.infer<typeof getFollowupsSchema>

const quickEditFollowupSchema = z.object({
  id: z.string().uuid(),
  status: requiredNativeEnum(FollowupStatus)
})

type QuickEditFollowupInput = z.infer<typeof quickEditFollowupSchema>

export {
  addFollowupSchema,
  editFollowupSchema,
  exportFollowupsSchema,
  getFollowupsSchema,
  quickEditFollowupSchema
}

export type {
  AddFollowupInput,
  EditFollowupInput,
  ExportFollowupsInput,
  GetFollowupsInput,
  QuickEditFollowupInput
}
