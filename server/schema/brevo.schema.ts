import { z } from 'zod'

export const exportBrevoContactsSchema = z.object({
  all: z.boolean()
})

export type ExportBrevoContactsInput = z.infer<typeof exportBrevoContactsSchema>
