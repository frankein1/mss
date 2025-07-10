import { z } from 'zod'
import { WorkshopAttendeeAttendance } from '@prisma/client'

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
