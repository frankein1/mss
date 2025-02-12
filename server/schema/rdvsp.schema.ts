import { z } from 'zod'

export const planAppointmentSchema = z.object({
  beneficiaryId: z.string().uuid()
})

export type PlanAppointmentInput = z.infer<typeof planAppointmentSchema>

export const toggleRdvspSchema = z.object({
  id: z.string().uuid(),
  externalRdvspActive: z.boolean()
})

export type ToggleRdvspInput = z.infer<typeof toggleRdvspSchema>
