import { z } from 'zod/v4'

export const exportBrevoContactsSchema = z.object({
  all: z.boolean()
})

export type ExportBrevoContactsInput = z.infer<typeof exportBrevoContactsSchema>
