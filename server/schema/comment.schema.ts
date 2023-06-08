import { z } from 'zod'

const addCommentSchema = z.object({
  content: z.string(),
  beneficiaryId: z.string().uuid(),
  isFollowup: z.boolean(),
  historyId: z.string().uuid()
})

type AddCommentInput = z.infer<typeof addCommentSchema>

export { addCommentSchema }
export type { AddCommentInput }
