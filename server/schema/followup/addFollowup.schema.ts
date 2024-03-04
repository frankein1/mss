import {
  FollowupMedium,
  SocialSupportStatus,
  Minister,
  FollowupDuration
} from '@prisma/client'
import { z } from 'zod'
import {
  requiredNativeEnum,
  withEmptyValueOptionalNativeEnum,
  stringConstraint,
  numeroPegaseContraint,
  dateOrEmpty,
  openText,
  stringOrEmpty
} from '../helpers.schema'
import {
  errorMessages,
  maxStringLengthMessage,
  requiredErrorMessage
} from '~/utils/zod'

export const addFollowupSchemaBase = z.object({
  isMinistry: z.boolean(),
  beneficiaryId: z.string().uuid(),
  types: z
    .array(z.string().uuid(), {
      ...errorMessages,
      required_error: requiredErrorMessage
    })
    .min(1, requiredErrorMessage),
  documents: z.array(z.string(), errorMessages).default([]),
  medium: requiredNativeEnum(FollowupMedium),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  date: z.coerce.date(errorMessages),
  synthesis: openText(6000).nullish(),
  privateSynthesis: openText(1000).nullish(),
  status: requiredNativeEnum(SocialSupportStatus),
  helpRequested: z.boolean().default(false),
  place: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  redirected: z.boolean().default(false),
  structureName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  dueDate: dateOrEmpty,
  thirdPersonName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  firstFollowup: z.boolean().default(false),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  prescribingOrganizationId: z.string().nullish(),
  classified: z.boolean().default(false),
  forwardedToJustice: z.boolean().default(false),
  duration: withEmptyValueOptionalNativeEnum(FollowupDuration)
})

export const addFollowupSchema = addFollowupSchemaBase.refine(
  val => !val.isMinistry || val.ministre,
  {
    message: requiredErrorMessage,
    path: ['ministre']
  }
)

export type AddFollowupInput = z.infer<typeof addFollowupSchema>
