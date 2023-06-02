import {
  HelpRequestReason,
  HelpRequestStatus,
  Minister,
  Prisma,
  PaymentMethod
} from '@prisma/client'
import { z } from 'zod'
import { helpRequestFilterSchema } from '~/server/schema'
import { errorMessages, kindOfBooleanSchema } from '~/utils/zod'

const createHelpRequestSchema = z.object({
  beneficiaryId: z.string().uuid(),
  openingDate: z.coerce.date(errorMessages),
  numeroPegase: z.string().nullish(),
  ministre: z.nativeEnum(Minister, errorMessages).nullish(),
  typeId: z.string(errorMessages).uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  financialSupport: kindOfBooleanSchema,
  externalStructure: kindOfBooleanSchema,
  status: z.nativeEnum(HelpRequestStatus, errorMessages),
  askedAmount: z.number().min(0).nullish(),
  examinationDate: z.coerce.date(errorMessages).nullish(),
  decisionDate: z.coerce.date(errorMessages).nullish(),
  allocatedAmount: z.number().min(0).nullish(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
  reason: z.nativeEnum(HelpRequestReason).nullish(),
  paymentDate: z.coerce.date(errorMessages).nullish(),
  handlingDate: z.coerce.date(errorMessages).nullish(),
  refusalReason: z.string().nullish(),
  prescribingOrganizationId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  dispatchDate: z.coerce.date(errorMessages).nullish(),
  synthesis: z.string().nullish(),
  privateSynthesis: z.string().nullish(),
  dueDate: z.coerce.date(errorMessages).nullish(),
  fullFile: z.boolean().default(false)
})

// const editHelpRequestSchema = createHelpRequestSchema.extend({
//   helpRequestId: z.string().uuid()
// })

const getHelpRequestsSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  orderBy: z.array(
    z.object({
      openingDate: z.nativeEnum(Prisma.SortOrder).optional(),
      dueDate: z.nativeEnum(Prisma.SortOrder).optional(),
      beneficiary: z
        .object({
          usualName: z.nativeEnum(Prisma.SortOrder).optional()
        })
        .optional()
    })
  ),
  filters: helpRequestFilterSchema
})

const quickEditHelpRequestStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(HelpRequestStatus)
})

const quickEditHelpRequestAllocatedAmountSchema = z.object({
  id: z.string().uuid(),
  allocatedAmount: z.coerce.number().nullable()
})

const quickEditHelpRequestPaymentMethodSchema = z.object({
  id: z.string().uuid(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable()
})

const quickEditHelpRequestPaymentDateSchema = z.object({
  id: z.string().uuid(),
  paymentDate: z.coerce.date().nullable()
})

const quickEditHelpRequestSchema = z.union([
  quickEditHelpRequestStatusSchema,
  quickEditHelpRequestAllocatedAmountSchema,
  quickEditHelpRequestPaymentMethodSchema,
  quickEditHelpRequestPaymentDateSchema
])

const editHelpRequestSchema = createHelpRequestSchema.extend({
  id: z.string().uuid()
})

type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
type GetHelpRequestsInput = z.infer<typeof getHelpRequestsSchema>
type QuickEditHelpRequestStatusInput = z.infer<
  typeof quickEditHelpRequestStatusSchema
>
type QuickEditHelpRequestAllocatedAmountInput = z.infer<
  typeof quickEditHelpRequestAllocatedAmountSchema
>
type QuickEditHelpRequestPaymentMethodInput = z.infer<
  typeof quickEditHelpRequestPaymentMethodSchema
>
type QuickEditHelpRequestPaymentDateInput = z.infer<
  typeof quickEditHelpRequestPaymentDateSchema
>
type QuickEditHelpRequestInput = z.infer<typeof quickEditHelpRequestSchema>
type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>

export {
  createHelpRequestSchema,
  quickEditHelpRequestSchema,
  getHelpRequestsSchema,
  quickEditHelpRequestStatusSchema,
  quickEditHelpRequestAllocatedAmountSchema,
  quickEditHelpRequestPaymentMethodSchema,
  quickEditHelpRequestPaymentDateSchema,
  editHelpRequestSchema
}

export type {
  CreateHelpRequestInput,
  QuickEditHelpRequestInput,
  GetHelpRequestsInput,
  QuickEditHelpRequestStatusInput,
  QuickEditHelpRequestAllocatedAmountInput,
  QuickEditHelpRequestPaymentMethodInput,
  QuickEditHelpRequestPaymentDateInput,
  EditHelpRequestInput
}
