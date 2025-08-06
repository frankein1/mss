import { z } from 'zod/v4'

export const planAppointmentSchema = z.object({
  beneficiaryId: z.uuid()
})

export type PlanAppointmentInput = z.infer<typeof planAppointmentSchema>

export const toggleRdvspSchema = z.object({
  id: z.uuid(),
  externalRdvspActive: z.boolean()
})

export type ToggleRdvspInput = z.infer<typeof toggleRdvspSchema>
