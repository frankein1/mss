import { UserActivityType } from '@prisma/client'
import { prepareGetFollowupsPageSelect } from './helper/prepareGetFollowupsPageSelect'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditFollowupInput,
  quickEditFollowupSchema
} from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { FollowupRepo } from '~/server/database'
import { FollowupService } from '~/server/services'

const handler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const select = prepareGetFollowupsPageSelect(user)

  const fu = await FollowupRepo.prisma.update({
    where: { id },
    data: rest,
    select
  })

  return fu
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: QuickEditFollowupInput
) => {
  const permissions = await FollowupService.getUpdatePermission(user, input.id)
  return permissions.edit
}

export const quickUpdateFollowupMutation = createMutation({
  handler,
  inputValidation: quickEditFollowupSchema,
  securityCheck,
  auditLog: {
    key: 'followup.quickUpdate',
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
