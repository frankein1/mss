import { nativeEnum, z } from 'zod'
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
  kindOfBooleanSchema,
  limitedStringConstraint,
  phoneConstraint,
  requiredNativeEnum,
  stringOrEmpty
} from '../helpers.schema'

export const createBeneficiaryAttendeeSchema = z.object({
  workshopIds: z.array(z.string().uuid().nonempty(), {
    required_error: 'Veuillez sélectionner au moins un atelier.'
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

export const createExternalAttendeeSchema = z.object({
  workshopId: z.string().uuid(),
  gender: nativeEnum(Gender).optional(),
  lastName: limitedStringConstraint(2, 50).toUpperCase().optional(),
  firstName: limitedStringConstraint(2, 50).optional(),
  birthDate: dateOrEmpty,
  phone: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  city: limitedStringConstraint(null, 50).optional(),
  comment: limitedStringConstraint(null, 500).optional(),
  paymentReceived: kindOfBooleanSchema(),
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
  gender: nativeEnum(Gender).nullable(),
  lastName: limitedStringConstraint().nullable(),
  firstName: limitedStringConstraint().nullable(),
  birthDate: dateOrEmpty,
  phone: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  city: limitedStringConstraint(null, 50).nullable(),
  comment: limitedStringConstraint(null, 500).nullable(),
  paymentReceived: kindOfBooleanSchema(),
  paymentAmount: amountNumber.nullish()
})
export type UpdateAttendeeInput = z.input<typeof updateAttendeeSchema>
export type UpdateAttendeeServerInput = z.infer<typeof updateAttendeeSchema>

export const deleteAttendeeSchema = z.object({
  id: z.string().uuid(),
  type: requiredNativeEnum(WorkshopAttendeeType)
})

export type DeleteAttendeeInput = z.infer<typeof deleteAttendeeSchema>
