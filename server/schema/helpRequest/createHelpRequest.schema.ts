import {
  HelpRequestReason,
  HelpRequestRefusalReason,
  HelpRequestStatus,
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
  stringConstraint,
  dateOrEmpty
} from '../helpers.schema'
import { errorMessages, maxStringLengthMessage } from '~/utils/zod'

export const createHelpRequestSchema = z.object({
  beneficiaryId: z.string().uuid(),
  openingDate: z.coerce.date(errorMessages),
  numeroPegase: numeroPegaseContraint.nullish(),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  typeId: z.string(errorMessages).uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  financialSupport: kindOfBooleanSchema(),
  externalStructure: kindOfBooleanSchema(),
  status: requiredNativeEnum(HelpRequestStatus),
  askedAmount: amountNumber.nullish(),
  examinationDate: dateOrEmpty,
  decisionDate: dateOrEmpty,
  allocatedAmount: amountNumber.nullish(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod),
  reason: withEmptyValueOptionalNativeEnum(HelpRequestReason),
  paymentDate: dateOrEmpty,
  handlingDate: dateOrEmpty,
  refusalReason: withEmptyValueOptionalNativeEnum(HelpRequestRefusalReason),
  prescribingOrganizationId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: dateOrEmpty,
  synthesis: stringConstraint.max(6000, maxStringLengthMessage(6000)).nullish(),
  privateSynthesis: stringConstraint
    .max(1000, maxStringLengthMessage(1000))
    .nullish(),
  dueDate: dateOrEmpty,
  fullFile: z.boolean().default(false)
})

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
