import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canDeleteHelpRequest
} from '~/server/security/rules'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { IdInput, idSchema } from '~/server/schema'
import { HelpRequestRepo } from '~/server/database'

function getHelpRequest(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
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
  await HelpRequestRepo.deleteEntity(user, { where: { id } })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'HelpRequest',
    objectId: id
  })
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const helpRequest = await getHelpRequest(user, input.id)
  return canDeleteHelpRequest(user, helpRequest)
}

export const deleteHelpRequestMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler
})
