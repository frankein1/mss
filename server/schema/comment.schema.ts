import { z } from 'zod/v4'
import { openText } from './helpers.schema'

const addCommentSchema = z.object({
  content: openText(3000),
  beneficiaryId: z.uuid(),
  isFollowup: z.boolean(),
  socialSupportId: z.uuid()
})

type AddCommentInput = z.infer<typeof addCommentSchema>

const editCommentSchema = z.object({
  content: openText(3000),
  commentId: z.uuid()
})

type EditCommentInput = z.infer<typeof editCommentSchema>

export { addCommentSchema, editCommentSchema }
export type { AddCommentInput, EditCommentInput }
