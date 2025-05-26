import { z } from 'zod'

export const getByFamilyFileIdSchema = z.object({
  familyFileId: z.string().uuid()
})

export type GetByFamilyFileIdInput = z.infer<typeof getByFamilyFileIdSchema>
