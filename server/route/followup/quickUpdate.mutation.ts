import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditFollowupInput,
  quickEditFollowupSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { FollowupService } from '~/server/services'
import { FollowupRepo } from '~/server/database'

const handler = ({
  input: { id, status },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  return FollowupRepo.update(user, {
    where: {
      id
    },
    data: {
      socialSupport: {
        update: {
          status
        }
      }
    },
    include: {
      socialSupport: {
        include: {
          beneficiary: {
            select: {
              id: true,
              fileNumber: true
            }
          }
        }
      }
    }
  })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: QuickEditFollowupInput
) => {
  const permissions = await FollowupService.getEditionPermissions(ctx, input.id)
  return permissions.edit
}

export const quickUpdate = createMutation({
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
