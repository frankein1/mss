import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { SocialSupportRepo } from '~/server/database'
import { SocialSupportService } from '~/server/services'

const handler = async ({
  ctx: { user },
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await SocialSupportRepo.delete(user, { where: { id } })
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
