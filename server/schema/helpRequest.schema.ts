import { HelpRequestStatus, Prisma, PaymentMethod } from '@prisma/client'
import { z } from 'zod'
import { helpRequestFilterSchema } from '~/server/schema'

// const createHelpRequestSchema = z.object({
//   beneficiaryId: z.string().uuid(),
//   openingDate: z.date(errorMessages),
//   type: z.string(errorMessages).uuid(),
//   documents: z.array(z.string(), errorMessages).default([]),
//   financialSupport: z.enum(['true', 'false']).nullish(),
//   externalStructure: z.enum(['true', 'false']).nullish(),
//   status: z.nativeEnum(HelpRequestStatus, errorMessages),
//   askedAmount: z.number().min(0).nullish(),
//   examinationDate: z.date(errorMessages).nullish(),
//   decisionDate: z.date(errorMessages).nullish(),
//   allocatedAmount: z.number().min(0).nullish(),
//   paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
//   reason: z.nativeEnum(HelpRequestReason).nullish(),
//   paymentDate: z.date(errorMessages).nullish(),
//   handlingDate: z.date(errorMessages).nullish(),
//   refusalReason: z.string().nullish(),
//   prescribingOrganisation: z.string().nullish(),
//   examiningOrganisation: z.string().nullish(),
//   dispatchDate: z.date(errorMessages).nullish(),
//   synthesis: z.string().nullish(),
//   privateSynthesis: z.string().nullish(),
//   dueDate: z.date(errorMessages).nullish(),
//   fullFile: z.boolean().default(false)
// })

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

const editHelpRequestStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(HelpRequestStatus)
})

const editHelpRequestAllocatedAmountSchema = z.object({
  id: z.string().uuid(),
  allocatedAmount: z.coerce.number().nullable()
})

const editHelpRequestPaymentMethodSchema = z.object({
  id: z.string().uuid(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable()
})

const editHelpRequestPaymentDateSchema = z.object({
  id: z.string().uuid(),
  paymentDate: z.coerce.date().nullable()
})

const editHelpRequestSchema = z.union([
  editHelpRequestStatusSchema,
  editHelpRequestAllocatedAmountSchema,
  editHelpRequestPaymentMethodSchema,
  editHelpRequestPaymentDateSchema
])

// type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
// type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>
type GetHelpRequestsInput = z.infer<typeof getHelpRequestsSchema>
type EditHelpRequestStatusInput = z.infer<typeof editHelpRequestStatusSchema>
type EditHelpRequestAllocatedAmountInput = z.infer<
  typeof editHelpRequestAllocatedAmountSchema
>
type EditHelpRequestPaymentMethodInput = z.infer<
  typeof editHelpRequestPaymentMethodSchema
>
type EditHelpRequestPaymentDateInput = z.infer<
  typeof editHelpRequestPaymentDateSchema
>
type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>

export {
  // createHelpRequestSchema,
  editHelpRequestSchema,
  getHelpRequestsSchema,
  editHelpRequestStatusSchema,
  editHelpRequestAllocatedAmountSchema,
  editHelpRequestPaymentMethodSchema,
  editHelpRequestPaymentDateSchema
}

export type {
  // CreateHelpRequestInput,
  EditHelpRequestInput,
  GetHelpRequestsInput,
  EditHelpRequestStatusInput,
  EditHelpRequestAllocatedAmountInput,
  EditHelpRequestPaymentMethodInput,
  EditHelpRequestPaymentDateInput
}
