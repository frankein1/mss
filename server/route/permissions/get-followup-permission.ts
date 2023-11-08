import { followupRule, prescribingOrgaRule, structureRule } from './rules'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security'
import { FollowupPermissions, createQuery } from '~/server/route'
import { GetPermissionsInput, getPermissionsSchema } from '~/server/schema'
import { hasAccessFollowupField } from '~/security/permission'
import {
  getBeneficiarySecurityTarget,
  getFollowupSecurityTarget
} from '~/server/query'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: GetPermissionsInput
}) => {
  const { user, structure } = ctx
  const { type } = structure

  const followup = input.targetId
    ? await getFollowupSecurityTarget(user, input.targetId)
    : null

  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )

  const permissions: FollowupPermissions = {
    actions: {
      create: followupRule.canCreate(user, beneficiary),
      edit: followup ? followupRule.canEdit(user, followup) : false,
      delete: followup ? followupRule.canDelete(user, followup) : false,
      editStructure: structureRule.canEdit(user),
      createPrescribingOrga: prescribingOrgaRule.canCreate(user)
    },
    fields: {
      numeroPegase: hasAccessFollowupField(type, 'numeroPegase'),
      ministre: hasAccessFollowupField(type, 'ministre'),
      classified: hasAccessFollowupField(type, 'classified'),
      forwardedToJustice: hasAccessFollowupField(type, 'forwardedToJustice'),
      interventions: hasAccessFollowupField(type, 'interventions'),
      signalements: hasAccessFollowupField(type, 'signalements'),
      privateSynthesis: followup
        ? followupRule.canEditPrivateSynthesis(user, followup)
        : true
    }
  }

  return Promise.resolve(permissions)
}

export const getFollowupPermissions = createQuery({
  inputValidation: getPermissionsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
