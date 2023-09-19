import { z } from 'zod'
import { stringConstraint, maxStringLengthMessage } from '~/utils/zod'

const addCommentSchema = z.object({
  content: stringConstraint.max(3000, maxStringLengthMessage(3000)),
  beneficiaryId: z.string().uuid(),
  isFollowup: z.boolean(),
  historyId: z.string().uuid()
})

type AddCommentInput = z.infer<typeof addCommentSchema>

export { addCommentSchema }
export type { AddCommentInput }
