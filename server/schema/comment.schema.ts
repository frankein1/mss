import { z } from 'zod'
import { openText } from './helpers.schema'

const addCommentSchema = z.object({
  content: openText(3000),
  beneficiaryId: z.string().uuid(),
  isFollowup: z.boolean(),
  historyId: z.string().uuid()
})

type AddCommentInput = z.infer<typeof addCommentSchema>

const editCommentSchema = z.object({
  content: openText(3000),
  commentId: z.string().uuid()
})

type EditCommentInput = z.infer<typeof editCommentSchema>

export { addCommentSchema, editCommentSchema }
export type { AddCommentInput, EditCommentInput }
