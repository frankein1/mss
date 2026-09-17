import { z } from 'zod'
import { validationCodeConstraint } from '../helpers.schema'

export const exportAttendanceSchema = z.object({
  code: validationCodeConstraint,
  workshopId: z.string().uuid()
})

export type ExportAttendanceInput = z.infer<typeof exportAttendanceSchema>
