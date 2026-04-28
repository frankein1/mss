import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { idSchema, type IdInput } from '~~/server/schema'
import { SocialSupportRepo } from '~~/server/database'
import { AllowSecurityCheck } from '~~/server/security/rules/types'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput
}) => {
  return SocialSupportRepo.count(ctx.user, {
    where: { supportProgramId: input.id }
  })
}

export const countLinkedSocialSupportsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
