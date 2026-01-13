import { z } from 'zod'
import { RdvspStatus } from '~/types/rdvsp'

export const planAppointmentSchema = z.object({
  beneficiaryId: z.string().uuid()
})

export type PlanAppointmentInput = z.infer<typeof planAppointmentSchema>

export const updateAppointmentStatusSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(RdvspStatus)
})

export type UpdateAppointmentStatusInput = z.infer<
  typeof updateAppointmentStatusSchema
>

export const getAppointmentSchema = z.object({
  id: z.number()
})

export type GetAppointmentInput = z.infer<typeof getAppointmentSchema>

export const toggleRdvspSchema = z.object({
  id: z.string().uuid(),
  externalRdvspActive: z.boolean()
})

export type ToggleRdvspInput = z.infer<typeof toggleRdvspSchema>
