import { prismaClient } from '~/server/prisma'
import { createMutation } from '~/server/route'
import { EditCommentInput, editCommentSchema } from '~/server/schema'
import {
  ProtectedAppContext,
  forbiddenError,
  notfoundError
} from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { canEditComment } from '~/server/security/rules/comment'

const handler = async ({
  ctx: { user },
  input: { commentId, content }
}: {
  ctx: ProtectedAppContext
  input: EditCommentInput
}) => {
  const comment = await prismaClient.comment.findUnique({
    where: { id: commentId }
  })

  if (!comment) {
    throw notfoundError()
  }

  if (!canEditComment(user, comment)) {
    throw forbiddenError()
  }

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
