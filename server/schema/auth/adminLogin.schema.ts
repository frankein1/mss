import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: z.string().email('Email non valide')
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>
