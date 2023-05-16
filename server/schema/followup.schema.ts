import { FollowupMedium, FollowupStatus, Prisma } from '@prisma/client'
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

const editFollowupStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(FollowupStatus)
})

type EditFollowupStatusInput = z.infer<typeof editFollowupStatusSchema>

export {
  addFollowupSchema,
  editFollowupSchema,
  getFollowupsSchema,
  editFollowupStatusSchema
}

export type {
  AddFollowupInput,
  EditFollowupInput,
  GetFollowupsInput,
  EditFollowupStatusInput
}
