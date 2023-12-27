import {
  HelpRequestReason,
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
  dateOrEmpty,
  openText
} from '../helpers.schema'
import { errorMessages } from '~/utils/zod'

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
  refusalReason: openText(100).nullish(),
  prescribingOrganizationId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: dateOrEmpty,
  synthesis: openText(6000).nullish(),
  privateSynthesis: openText().nullish(),
  dueDate: dateOrEmpty,
  fullFile: z.boolean().default(false)
})

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
