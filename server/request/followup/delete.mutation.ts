import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/request'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleGrantee, canDeleteFollowup } from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { IdInput, idSchema } from '~/server/schema'

function getFollowup(id: string) {
  return prismaClient.followup.findUniqueOrThrow({
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
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await prismaClient.followup.delete({ where: { id } })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'Followup',
    objectId: id
  })
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const followup = await getFollowup(input.id)

  return canDeleteFollowup(user, followup)
}

export const deleteFollowupMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler
})
