import {
  FileInstructionRefusalReason,
  SocialSupportStatus,
  Minister,
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
  stringOrEmpty
} from '../helpers.schema'
import { errorMessages, requiredErrorMessage } from '~/utils/zod'

export const createHelpRequestSchemaBase = z.object({
  isMinistry: z.boolean(),
  beneficiaryId: z.string().uuid(),
  date: z.coerce.date(errorMessages),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  subjectId: z.string(errorMessages).uuid(),
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
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: dateOrEmpty,
  synthesis: openText(6000).nullish(),
  privateSynthesis: openText(1000).nullish(),
  dueDate: dateOrEmpty,
  fullFile: z.boolean().default(false),
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
