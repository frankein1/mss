import { z } from 'zod/v4'
import { WorkshopAttendeeAttendance } from '@prisma/client'

export const createAttendeeSchema = z.object({
  workshopId: z.uuid(),
  beneficiaryId: z.uuid()
})

export type CreateAttendeeInput = z.infer<typeof createAttendeeSchema>

export const updateAttendeeAttendanceSchema = z.object({
  id: z.uuid(),
  attendance: z.enum(WorkshopAttendeeAttendance)
})

export type UpdateAttendeeAttendanceInput = z.infer<
  typeof updateAttendeeAttendanceSchema
>
