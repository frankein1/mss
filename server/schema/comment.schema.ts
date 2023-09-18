import { z } from 'zod'
import { wordConstraint } from '~/utils/zod'

const addCommentSchema = z.object({
  content: wordConstraint(3000),
  beneficiaryId: z.string().uuid(),
  isFollowup: z.boolean(),
  historyId: z.string().uuid()
})

type AddCommentInput = z.infer<typeof addCommentSchema>

export { addCommentSchema }
export type { AddCommentInput }
