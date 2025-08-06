import { z } from 'zod/v4'

export const adminSendEmailSchema = z.object({
  id: z.uuid()
})

export type AdminSendEmailInput = z.infer<typeof adminSendEmailSchema>
