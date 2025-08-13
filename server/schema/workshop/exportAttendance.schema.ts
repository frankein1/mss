import { z } from 'zod'
import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

export const exportAttendanceSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
  workshopId: z.string().uuid()
})

export type ExportAttendanceInput = z.infer<typeof exportAttendanceSchema>
