import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  AllowSecurityCheck,
  SecurityRuleGrantee
} from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'
import { WorkshopRepo } from '~/server/database'

export const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: { id: string }
}) => {
  return await getOne(user, input.id)
}

export const getOne = async (user: SecurityRuleGrantee, id: string) => {
  return await WorkshopRepo.findUniqueOrThrow(user, {
    where: { id },
    include: { workshopName: true }
  })
}

export const getQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: idSchema
})
