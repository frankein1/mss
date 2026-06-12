import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { SocialSupportRepo } from '~/server/database'
import { SocialSupportService } from '~/server/services'
import { deleteOrphanedRedirectionReasons } from '~/server/services/redirection/helper'

const handler = async ({
  ctx: { user },
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { socialSupportRedirections } =
    await SocialSupportRepo.findUniqueOrThrow(user, {
      where: { id },
      select: {
        id: true,
        socialSupportRedirections: { select: { redirectionReasonId: true } }
      }
    })
  await SocialSupportRepo.delete(user, { where: { id } })
  await deleteOrphanedRedirectionReasons(
    socialSupportRedirections.map(r => r.redirectionReasonId)
  )
}

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await SocialSupportService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.delete
}

export const remove = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'socialSupport.delete',
    target: 'SocialSupport',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
