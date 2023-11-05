import { z } from 'zod'
import { stringConstraint } from './helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

const addCommentSchema = z.object({
  content: stringConstraint.max(3000, maxStringLengthMessage(3000)),
  beneficiaryId: z.string().uuid(),
  isFollowup: z.boolean(),
  historyId: z.string().uuid()
})

type AddCommentInput = z.infer<typeof addCommentSchema>

const editCommentSchema = z.object({
  content: stringConstraint.max(3000, maxStringLengthMessage(3000)),
  commentId: z.string().uuid()
})

type EditCommentInput = z.infer<typeof editCommentSchema>

export { addCommentSchema, editCommentSchema }
export type { AddCommentInput, EditCommentInput }
