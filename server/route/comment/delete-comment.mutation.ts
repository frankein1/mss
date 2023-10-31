import { prismaClient } from '~/server/prisma'
import { createMutation } from '~/server/route'
import { idSchema } from '~/server/schema'
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
  input: { id }
}: {
  ctx: ProtectedAppContext
  input: { id: string }
}) => {
  const comment = await prismaClient.comment.findUnique({ where: { id } })

  if (!comment) {
    throw notfoundError()
  }

  if (!canEditComment(user, comment)) {
    throw forbiddenError()
  }

  return await prismaClient.comment.delete({
    where: { id },
    include: COMMENT_RELATIONS_INCLUDE
  })
}

export const deleteCommentMutation = createMutation({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
