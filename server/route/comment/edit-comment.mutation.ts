import { prismaClient } from '~/server/prisma'
import { createMutation } from '~/server/route'
import { EditCommentInput, editCommentSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'

const handler = async ({
  ctx: { user },
  input: { commentId, content }
}: {
  ctx: ProtectedAppContext
  input: EditCommentInput
}) => {
  // TODO: security checks
  // TODO: compare to add-comment-mutation if other actions are necessary

  return await prismaClient.comment.update({
    where: { id: commentId },
    data: {
      content,
      updatedById: user.id
    },
    include: COMMENT_RELATIONS_INCLUDE
  })
}

export const editCommentMutation = createMutation({
  inputValidation: editCommentSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
