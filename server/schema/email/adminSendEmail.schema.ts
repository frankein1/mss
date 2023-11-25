import { z } from 'zod'

export const adminSendEmailSchema = z.object({
  id: z.string().uuid()
})

export type AdminSendEmailInput = z.infer<typeof adminSendEmailSchema>
