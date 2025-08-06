import {
  FileInstructionRefusalReason,
  SocialSupportStatus,
  Minister,
  PaymentMethod
} from '@prisma/client'
import { z } from 'zod/v4'
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

export const createHelpRequestSchemaBase = z.object({
  isMinistry: z.boolean(),
  familyFileId: z.uuid(),
  beneficiaryId: z.uuid(),
  date: z.coerce.date(errorMessages),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  subjectId: z.uuid({
          error: (issue) => issue.input === undefined ? requiredErrorMessage : requiredErrorMessage
      }),
  documents: z.array(z.string(), errorMessages).prefault([]),
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
  fullFile: z.boolean().prefault(false),
  financialSupport: z.boolean(),
  isRefundable: kindOfBooleanSchema()
})

export const createHelpRequestSchema = createHelpRequestSchemaBase.refine(
  val => !val.isMinistry || val.ministre,
  {
    message: requiredErrorMessage,
    path: ['ministre']
  }
)

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
