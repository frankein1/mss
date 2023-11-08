import { z } from 'zod'

export const getPermissionsSchema = z.object({
  beneficiaryId: z.string().uuid(),
  targetId: z.string().uuid().nullish(),
})

export type GetPermissionsInput = z.infer<typeof getPermissionsSchema>
