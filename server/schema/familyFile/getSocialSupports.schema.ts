import { z } from 'zod'
import { socialSupportFilterSchema } from '../filter.schema'

export const getSocialSupportsSchema = z.object({
  familyFileId: z.string().uuid(),
  filters: socialSupportFilterSchema
})

export type GetSocialSupportsInput = z.infer<typeof getSocialSupportsSchema>
