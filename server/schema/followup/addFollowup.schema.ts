import {
  FollowupMedium,
  SocialSupportStatus,
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
  stringOrEmpty,
  openRichText
} from '../helpers.schema'
import {
  errorMessages,
  maxStringLengthMessage,
  requiredErrorMessage
} from '~/utils/zod'
import { SocialSupportRedirectionSchema } from '../redirection'

// TODO: etre plus restrictif sur synthesisRichText et privateSynthesisRichText
export const addFollowupSchemaBase = z.object({
  isMinistry: z.boolean(),
  familyFileId: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  subjects: z
    .array(z.string().uuid(), {
      ...errorMessages,
      required_error: requiredErrorMessage
    })
    .min(1, requiredErrorMessage),
  documents: z.array(z.string(), errorMessages).default([]),
  medium: requiredNativeEnum(FollowupMedium),
  ministerId: z.string().uuid().nullish(),
  date: z.coerce.date(errorMessages),
  synthesis: openText(6000).nullish(),
  synthesisRichText: openRichText().nullish(),
  privateSynthesis: openText(1000).nullish(),
  privateSynthesisRichText: openRichText().nullish(),
  status: requiredNativeEnum(SocialSupportStatus),
  helpRequested: z.boolean().default(false),
  place: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  dueDate: dateOrEmpty,
  thirdPersonName: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  firstFollowup: z.boolean().default(false),
  endOfSocialSupport: z.boolean().default(false),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  prescribingOrganizationId: z.string().nullish(),
  prescribingOrganizationContactId: z.string().nullish(),
  classified: z.boolean().default(false),
  forwardedToJustice: z.boolean().default(false),
  duration: withEmptyValueOptionalNativeEnum(FollowupDuration),
  socialSupportRedirections: z.array(SocialSupportRedirectionSchema).nullish(),
  beneficiaryDeviceId: z.string().nullish()
})

export const addFollowupSchema = z.discriminatedUnion('isMinistry', [
  addFollowupSchemaBase.extend({
    isMinistry: z.literal(true) as z.ZodLiteral<boolean>,
    ministerId: z
      .string({
        required_error: 'Veuillez renseigner ce champ.',
        invalid_type_error: 'Veuillez renseigner ce champ.'
      })
      .min(1, 'Veuillez renseigner ce champ.')
      .uuid('Veuillez renseigner ce champ.')
  }),
  addFollowupSchemaBase.extend({
    isMinistry: z.literal(false) as z.ZodLiteral<boolean>,
    ministerId: z.string().uuid().nullish()
  })
])

export type AddFollowupInput = z.infer<typeof addFollowupSchema>
