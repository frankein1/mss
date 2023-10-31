import { prismaClient } from '~/server/prisma'
import { createMutation } from '~/server/route'
import { idSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'

const handler = async ({
  input: { id }
}: {
  ctx: ProtectedAppContext
  input: { id: string }
}) => {
  // TODO: security checks
  // TODO: compare to add-comment-mutation if other actions are necessary

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
