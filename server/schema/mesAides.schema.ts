import { z } from 'zod'

export const prefillSimulationSchema = z.object({
  familyFileId: z.string().uuid()
})

export type PrefillSimulationInput = z.infer<typeof prefillSimulationSchema>
