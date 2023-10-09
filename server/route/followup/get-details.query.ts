import { getFollowupAccessibleData } from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canViewFollowup } from '~/server/security/rules'
import { getFollowupWithRelations } from '~/server/query/followups'
import { IdInput, idSchema } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const followup = await getFollowupWithRelations(id)

  const data = getFollowupAccessibleData(user, followup)

  return data
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const followup = await prismaClient.followup.findUniqueOrThrow({
    where: { id: input.id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
  return canViewFollowup(user, followup.beneficiary)
}

export const getFollowupDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
