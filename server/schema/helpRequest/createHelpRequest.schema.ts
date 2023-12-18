import {
  HelpRequestStatus,
  Minister,
  PaymentMethod,
  HelpRequestSubject
} from '@prisma/client'
import { z } from 'zod'
import {
  numeroPegaseContraint,
  withEmptyValueOptionalNativeEnum,
  kindOfBooleanSchema,
  requiredNativeEnum,
  amountNumber,
  dateOrEmpty,
  openText
} from '../helpers.schema'
import { errorMessages, requiredErrorMessage } from '~/utils/zod'

export const createHelpRequestSchemaBase = z.object({
  isMinistry: z.boolean(),
  beneficiaryId: z.string().uuid(),
  openingDate: z.coerce.date(errorMessages),
  numeroPegase: numeroPegaseContraint.nullish(),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  typeId: z.string(errorMessages).uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  externalStructure: kindOfBooleanSchema(),
  status: requiredNativeEnum(HelpRequestStatus),
  askedAmount: amountNumber.nullish(),
  examinationDate: dateOrEmpty,
  decisionDate: dateOrEmpty,
  allocatedAmount: amountNumber.nullish(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod),
  paymentDate: dateOrEmpty,
  handlingDate: dateOrEmpty,
  refusalReason: openText(100).nullish(),
  prescribingOrganizationId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: dateOrEmpty,
  synthesis: openText(6000).nullish(),
  privateSynthesis: openText(1000).nullish(),
  dueDate: dateOrEmpty,
  fullFile: z.boolean().default(false),
  subject: requiredNativeEnum(HelpRequestSubject)
})

export const createHelpRequestSchema = createHelpRequestSchemaBase.refine(
  val => !val.isMinistry || val.ministre,
  {
    message: requiredErrorMessage,
    path: ['ministre']
  }
)

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
