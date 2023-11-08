import {
  helpRequestRule,
  prescribingOrgaRule,
  instructorOrgaRule,
  structureRule
} from './rules'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security'
import {
  HelpRequestPermissions,
  createQuery
} from '~/server/route'
import { GetPermissionsInput, getPermissionsSchema } from '~/server/schema'
import { hasAccessHelpRequestField } from '~/security/permission'
import { getHelpRequestsecurityTarget } from '~/server/query'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: GetPermissionsInput
}) => {
  const { user, structure } = ctx
  const { type } = structure

  const helpRequest = input.targetId
    ? await getHelpRequestsecurityTarget(user, input.targetId)
    : null

  const permissions: HelpRequestPermissions = {
    actions: {
      edit: helpRequest ? helpRequestRule.canEdit(user, helpRequest) : false,
      delete: helpRequest
        ? helpRequestRule.canDelete(user, helpRequest)
        : false,
      editStructure: structureRule.canEdit(user),
      createPrescribingOrga: prescribingOrgaRule.canCreate(user),
      createInstructorOrga: instructorOrgaRule.canCreate(user)
    },
    fields: {
      numeroPegase: hasAccessHelpRequestField(type, 'numeroPegase'),
      ministre: hasAccessHelpRequestField(type, 'ministre'),
      privateSynthesis: helpRequest
        ? helpRequestRule.canEditPrivateSynthesis(user, helpRequest)
        : true
    }
  }

  return Promise.resolve(permissions)
}

export const getHelpRequestPermissions = createQuery({
  inputValidation: getPermissionsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
