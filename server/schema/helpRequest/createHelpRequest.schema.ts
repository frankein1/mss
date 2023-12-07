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
  stringConstraint
} from '../helpers.schema'
import { errorMessages, maxStringLengthMessage } from '~/utils/zod'

export const createHelpRequestSchema = z.object({
  beneficiaryId: z.string().uuid(),
  openingDate: z.coerce.date(errorMessages),
  numeroPegase: numeroPegaseContraint.nullish(),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  typeId: z.string(errorMessages).uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  externalStructure: kindOfBooleanSchema(),
  status: requiredNativeEnum(HelpRequestStatus),
  askedAmount: amountNumber.nullish(),
  examinationDate: z.coerce.date().nullish(),
  decisionDate: z.coerce.date().nullish(),
  allocatedAmount: amountNumber.nullish(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod),
  paymentDate: z.coerce.date().nullish(),
  handlingDate: z.coerce.date().nullish(),
  refusalReason: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  prescribingOrganizationId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: z.coerce.date().nullish(),
  synthesis: stringConstraint.max(6000, maxStringLengthMessage(6000)).nullish(),
  privateSynthesis: stringConstraint
    .max(1000, maxStringLengthMessage(1000))
    .nullish(),
  dueDate: z.coerce.date().nullish(),
  fullFile: z.boolean().default(false),
  subject: requiredNativeEnum(HelpRequestSubject)
})

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
