import {
  HelpRequestReason,
  HelpRequestStatus,
  Minister,
  PaymentMethod
} from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  numeroPegaseContraint,
  withEmptyValueOptionalNativeEnum,
  kindOfBooleanSchema,
  requiredNativeEnum,
  amountNumber,
  stringConstraint,
  maxStringLengthMessage
} from '~/utils/zod'

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
  examinationDate: z.coerce.date(errorMessages).nullish(),
  decisionDate: z.coerce.date(errorMessages).nullish(),
  allocatedAmount: amountNumber.nullish(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod),
  reason: withEmptyValueOptionalNativeEnum(HelpRequestReason),
  paymentDate: z.coerce.date(errorMessages).nullish(),
  handlingDate: z.coerce.date(errorMessages).nullish(),
  refusalReason: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  prescribingOrganizationId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: z.coerce.date(errorMessages).nullish(),
  synthesis: stringConstraint.max(6000, maxStringLengthMessage(6000)).nullish(),
  privateSynthesis: stringConstraint
    .max(1000, maxStringLengthMessage(1000))
    .nullish(),
  dueDate: z.coerce.date(errorMessages).nullish(),
  fullFile: z.boolean().default(false)
})

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
