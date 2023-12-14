import { getHelpRequestAccessibleData } from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  getHelpRequestPermissions
} from '~/server/security'
import {
  getHelpRequestWithRelations,
  getHelpRequestSecurityTarget
} from '~/server/query/helpRequests'
import { IdInput, idSchema } from '~/server/schema'
import { getStructureByUser } from '~/server/query'

const handler = async ({
  input: { id },
  ctx: { user, structure }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const helpRequest = await getHelpRequestWithRelations(user, id)
  const permissions = getHelpRequestPermissions({
    user,
    structure,
    target: helpRequest
  })

  const data = getHelpRequestAccessibleData(permissions, helpRequest)

  return data
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const [target, structure] = await Promise.all([
    getHelpRequestSecurityTarget(user, input.id),
    getStructureByUser(user)
  ])
  const permissions = getHelpRequestPermissions({ user, structure, target })
  return permissions.view
}

export const getHelpRequestDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
