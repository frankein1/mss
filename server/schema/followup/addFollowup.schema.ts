import {
  FollowupMedium,
  SocialSupportStatus,
  Minister,
  FollowupDuration
} from '@prisma/client'
import { z } from 'zod/v4'
import {
  requiredNativeEnum,
  withEmptyValueOptionalNativeEnum,
  stringConstraint,
  numeroPegaseContraint,
  dateOrEmpty,
  openText,
  stringOrEmpty,
  openRichText
} from '../helpers.schema'
import {
  errorMessages,
  maxStringLengthMessage,
  requiredErrorMessage
} from '~/utils/zod'

// TODO: etre plus restrictif sur synthesisRichText et privateSynthesisRichText
export const addFollowupSchemaBase = z.object({
  isMinistry: z.boolean(),
  familyFileId: z.uuid(),
  beneficiaryId: z.uuid(),
  subjects: z
    .array(z.uuid(), {
      ...errorMessages,
        error: (issue) => issue.input === undefined ? requiredErrorMessage : undefined
    })
    .min(1, requiredErrorMessage),
  documents: z.array(z.string(), errorMessages).prefault([]),
  medium: requiredNativeEnum(FollowupMedium),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  date: z.coerce.date(errorMessages),
  synthesis: openText(6000).nullish(),
  synthesisRichText: openRichText().nullish(),
  privateSynthesis: openText(1000).nullish(),
  privateSynthesisRichText: openRichText().nullish(),
  status: requiredNativeEnum(SocialSupportStatus),
  helpRequested: z.boolean().prefault(false),
  place: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  redirected: z.boolean().prefault(false),
  structureName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  dueDate: dateOrEmpty,
  thirdPersonName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  firstFollowup: z.boolean().prefault(false),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  prescribingOrganizationId: z.string().nullish(),
  prescribingOrganizationContactId: z.string().nullish(),
  classified: z.boolean().prefault(false),
  forwardedToJustice: z.boolean().prefault(false),
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
