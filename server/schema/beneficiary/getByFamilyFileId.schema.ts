import { z } from 'zod/v4'

export const getByFamilyFileIdSchema = z.object({
  familyFileId: z.uuid()
})

export type GetByFamilyFileIdInput = z.infer<typeof getByFamilyFileIdSchema>
