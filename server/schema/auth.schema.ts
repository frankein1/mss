import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: z.string()
})
type AdminLoginInput = z.infer<typeof adminLoginSchema>

export const acceptCGUSchema = z.object({
  read: z.coerce
    .boolean()
    .refine(value => value === true, { message: 'Veuillez lire les CGU.' }),
  accept: z.coerce
    .boolean()
    .refine(value => value === true, { message: 'Veuillez accepter les CGU.' })
})

type AcceptCGUInput = z.infer<typeof acceptCGUSchema>

export type { AcceptCGUInput, AdminLoginInput }
