import { z } from 'zod'
import { siretConstraint } from '..'

export const siretSchema = z.object({
  siret: siretConstraint
})

export type SiretInput = z.infer<typeof siretSchema>
