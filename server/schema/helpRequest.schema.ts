import {
  HelpRequestReason,
  HelpRequestStatus,
  Minister,
  Prisma,
  PaymentMethod
} from '@prisma/client'
import { z } from 'zod'
import { paginatedSchema } from './helpers.schema'
import { helpRequestFilterSchema } from './filter.schema'
import {
  errorMessages,
  kindOfBooleanSchema,
  withEmptyValueOptionalNativeEnum,
  requiredNativeEnum
} from '~/utils/zod'

const createHelpRequestSchema = z.object({
  beneficiaryId: z.string().uuid(),
  openingDate: z.coerce.date(errorMessages),
  numeroPegase: z.string().nullish(),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  typeId: z.string(errorMessages).uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  financialSupport: kindOfBooleanSchema,
  externalStructure: kindOfBooleanSchema,
  status: requiredNativeEnum(HelpRequestStatus),
  askedAmount: z.number().min(0).nullish(),
  examinationDate: z.coerce.date(errorMessages).nullish(),
  decisionDate: z.coerce.date(errorMessages).nullish(),
  allocatedAmount: z.number().min(0).nullish(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod),
  reason: withEmptyValueOptionalNativeEnum(HelpRequestReason),
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

const getHelpRequestsSchema = z
  .object({
    orderBy: z.array(
      z.object({
        openingDate: z.nativeEnum(Prisma.SortOrder).optional(),
        dueDate: z.nativeEnum(Prisma.SortOrder).optional(),
        beneficiary: z
          .object({
            usualName: z.nativeEnum(Prisma.SortOrder).optional()
          })
          .optional(),
        instructorOrganization: z
          .object({
            name: z.nativeEnum(Prisma.SortOrder).optional()
          })
          .optional()
      })
    ),
    filters: helpRequestFilterSchema
  })
  .merge(paginatedSchema)

const quickEditHelpRequestStatusSchema = z.object({
  id: z.string().uuid(),
  status: requiredNativeEnum(HelpRequestStatus)
})

const quickEditHelpRequestAllocatedAmountSchema = z.object({
  id: z.string().uuid(),
  allocatedAmount: z.coerce.number().nullable()
})

const quickEditHelpRequestPaymentMethodSchema = z.object({
  id: z.string().uuid(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod)
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
type GetHelpRequestsInputOrderBy = GetHelpRequestsInput['orderBy']
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
  EditHelpRequestInput,
  GetHelpRequestsInputOrderBy
}
