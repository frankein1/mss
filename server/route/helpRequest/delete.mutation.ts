import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { HelpRequestRepo } from '~~/server/database'
import { HelpRequestService } from '~~/server/services'

const handler = async ({
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await HelpRequestRepo.prisma.delete({ where: { id } })
}

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await HelpRequestService.getEditionPermissions(
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
    key: 'helpRequest.delete',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
