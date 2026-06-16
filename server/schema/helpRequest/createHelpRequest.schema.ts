import {
  FileInstructionRefusalReason,
  SocialSupportStatus,
  PaymentMethod
} from '@prisma/client'
import { z } from 'zod'
import {
  numeroPegaseContraint,
  withEmptyValueOptionalNativeEnum,
  kindOfBooleanSchema,
  requiredNativeEnum,
  amountNumber,
  dateOrEmpty,
  openText,
  stringOrEmpty,
  openRichText
} from '../helpers.schema'
import { errorMessages, requiredErrorMessage } from '~/utils/zod'
import { SocialSupportRedirectionSchema } from '../redirection'

export const createHelpRequestSchemaBase = z.object({
  isMinistry: z.boolean(),
  familyFileId: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  date: z.coerce.date(errorMessages),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  ministerId: z.string().uuid().nullish(),
  subjectId: z
    .string({
      required_error: requiredErrorMessage,
      invalid_type_error: requiredErrorMessage
    })
    .uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  externalStructure: kindOfBooleanSchema(true),
  status: requiredNativeEnum(SocialSupportStatus),
  askedAmount: amountNumber.nullish(),
  examinationDate: dateOrEmpty,
  decisionDate: dateOrEmpty,
  allocatedAmount: amountNumber.nullish(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod),
  paymentDate: dateOrEmpty,
  handlingDate: dateOrEmpty,
  refusalReason: withEmptyValueOptionalNativeEnum(FileInstructionRefusalReason),
  prescribingOrganizationId: z.string().nullish(),
  prescribingOrganizationContactId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  instructorOrganizationContactId: z.string().nullish(),
  dispatchDate: dateOrEmpty,
  synthesis: openText(6000).nullish(),
  synthesisRichText: openRichText().nullish(),
  privateSynthesis: openText(1000).nullish(),
  privateSynthesisRichText: openRichText().nullish(),
  dueDate: dateOrEmpty,
  fullFile: z.boolean().default(false),
  endOfSocialSupport: z.boolean().default(false),
  financialSupport: z.boolean(),
  isRefundable: kindOfBooleanSchema(),
  socialSupportRedirections: z.array(SocialSupportRedirectionSchema).nullish(),
  supportProgramId: z.string().nullish()
})

export const createHelpRequestSchema = z.discriminatedUnion('isMinistry', [
  createHelpRequestSchemaBase.extend({
    isMinistry: z.literal(true) as z.ZodLiteral<boolean>,
    ministerId: z
      .string({
        required_error: 'Veuillez renseigner ce champ.',
        invalid_type_error: 'Veuillez renseigner ce champ.'
      })
      .min(1, 'Veuillez renseigner ce champ.')
      .uuid('Veuillez renseigner ce champ.')
  }),
  createHelpRequestSchemaBase.extend({
    isMinistry: z.literal(false) as z.ZodLiteral<boolean>,
    ministerId: z.string().uuid().nullish()
  })
])

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
