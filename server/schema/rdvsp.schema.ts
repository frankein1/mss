import { z } from 'zod'

export const planAppointmentSchema = z.object({
  beneficiaryId: z.string().uuid()
})

export type PlanAppointmentInput = z.infer<typeof planAppointmentSchema>
