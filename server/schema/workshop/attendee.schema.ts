import { z } from 'zod/v4'
import {
  Gender,
  WorkshopAttendeeAttendance,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import {
  amountNumber,
  dateOrEmpty,
  emailOrEmpty,
  limitedStringConstraint,
  phoneConstraint,
  requiredNativeEnum,
  stringOrEmpty
} from '../helpers.schema'

export const createBeneficiaryAttendeeSchema = z.object({
  workshopIds: z.array(z.string().uuid().nonempty(), {
    error: issue =>
      issue.input === undefined
        ? 'Veuillez sélectionner au moins un atelier.'
        : undefined
  }),
  beneficiaryId: z
    .string()
    .uuid()
    .nonempty({ message: 'Veuillez sélectionner un bénéficiaire.' })
})

export type CreateBeneficiaryAttendeeInput = z.infer<
  typeof createBeneficiaryAttendeeSchema
>

export const updateAttendeeAttendanceSchema = z.object({
  id: z.string().uuid(),
  attendance: z.nativeEnum(WorkshopAttendeeAttendance)
})

export type UpdateAttendeeAttendanceInput = z.infer<
  typeof updateAttendeeAttendanceSchema
>

export const updateAttendeeListTypeSchema = z.object({
  id: z.string().uuid(),
  listType: z.nativeEnum(WorkshopAttendeeListType)
})

export type UpdateAttendeeListTypeInput = z.infer<
  typeof updateAttendeeListTypeSchema
>

const paymentReceivedSchema = z
  .union([z.enum(['true', 'false', '']), z.boolean()])
  .nullish()
  .transform(v => {
    if (v === 'false' || v === false) {
      return false
    }
    if (v === 'true' || v === true) {
      return true
    }
    return null
  })

export const createExternalAttendeeSchema = z.object({
  workshopId: z.string().uuid(),
  gender: z.nativeEnum(Gender).optional(),
  lastName: limitedStringConstraint(2, 50).toUpperCase().optional(),
  firstName: limitedStringConstraint(2, 50).optional(),
  birthDate: dateOrEmpty,
  phone: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  city: limitedStringConstraint(null, 50).optional(),
  comment: limitedStringConstraint(null, 500).optional(),
  paymentReceived: paymentReceivedSchema,
  paymentAmount: amountNumber.nullish()
})

export type CreateExternalAttendeeInput = z.input<
  typeof createExternalAttendeeSchema
>
export type CreateExternalAttendeeServerInput = z.infer<
  typeof createExternalAttendeeSchema
>

export const updateAttendeeSchema = z.object({
  attendeeId: z.string().uuid(),
  type: requiredNativeEnum(WorkshopAttendeeType),
  gender: z.nativeEnum(Gender).nullable(),
  lastName: limitedStringConstraint().nullable(),
  firstName: limitedStringConstraint().nullable(),
  birthDate: dateOrEmpty,
  phone: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  city: limitedStringConstraint(null, 50).nullable(),
  comment: limitedStringConstraint(null, 500).nullable(),
  paymentReceived: paymentReceivedSchema,
  paymentAmount: amountNumber.nullish()
})
export type UpdateAttendeeInput = z.input<typeof updateAttendeeSchema>
export type UpdateAttendeeServerInput = z.infer<typeof updateAttendeeSchema>

export const deleteAttendeeSchema = z.object({
  id: z.string().uuid(),
  type: requiredNativeEnum(WorkshopAttendeeType)
})

export type DeleteAttendeeInput = z.infer<typeof deleteAttendeeSchema>
