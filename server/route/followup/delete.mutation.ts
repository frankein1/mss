import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleGrantee, canDeleteFollowup } from '~/server/security/rules'
import { IdInput, idSchema } from '~/server/schema'
import { FollowupRepo } from '~/server/database'

function getFollowup(user: SecurityRuleGrantee, id: string) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
}

const handler = async ({
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await FollowupRepo.prisma.delete({ where: { id } })
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const followup = await getFollowup(user, input.id)

  return canDeleteFollowup(user, followup)
}

export const deleteFollowupMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
