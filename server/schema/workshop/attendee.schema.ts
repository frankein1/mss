import { nativeEnum, z } from 'zod'
import {
  Gender,
  WorkshopAttendeeAttendance,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import {
  dateOrEmpty,
  emailOrEmpty,
  limitedStringConstraint,
  phoneConstraint,
  requiredNativeEnum,
  stringOrEmpty
} from '../helpers.schema'

export const createAttendeeSchema = z.object({
  workshopId: z.string().uuid(),
  beneficiaryId: z.string().uuid()
})

export type CreateAttendeeInput = z.infer<typeof createAttendeeSchema>

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
  lastName: limitedStringConstraint().optional(),
  firstName: limitedStringConstraint().optional(),
  birthDate: dateOrEmpty,
  phone: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  zipcode: stringOrEmpty(limitedStringConstraint(4, 6)),
  city: limitedStringConstraint(null, 50).optional(),
  comment: limitedStringConstraint(null, 500).optional()
})

export type CreateExternalAttendeeInput = z.infer<
  typeof createExternalAttendeeSchema
>

export const deleteAttendeeSchema = z.object({
  id: z.string().uuid(),
  type: requiredNativeEnum(WorkshopAttendeeType)
})

export type DeleteAttendeeInput = z.infer<typeof deleteAttendeeSchema>
