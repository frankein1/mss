import { ProtectedAppContext } from '~/server/trpc'
import {
  AllowSecurityCheck,
  canCreatePrescribingOrganization,
  canEditFollowupPrivateSynthesis,
  canEditItsOwnStructure
} from '~/server/security'
import { createQuery } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { hasAccessFollowupField } from '~/security/permission'
import { getFollowupSecurityTarget } from '~/server/query'

export type FollowupPermissions = {
  actions: {
    editStructure: boolean
    createPrescribingOrganization: boolean
  }
  fields: {
    numeroPegase: boolean
    ministre: boolean
    classified: boolean
    forwardedToJustice: boolean
    interventions: boolean
    signalements: boolean
    privateSynthesis: boolean
  }
}

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput | undefined
}) => {
  const { user, structure } = ctx
  const { type } = structure

  const followup = input
    ? await getFollowupSecurityTarget(user, input.id)
    : null

  const permissions: FollowupPermissions = {
    actions: {
      editStructure: canEditItsOwnStructure(user),
      createPrescribingOrganization: canCreatePrescribingOrganization(user)
    },
    fields: {
      numeroPegase: hasAccessFollowupField(type, 'numeroPegase'),
      ministre: hasAccessFollowupField(type, 'ministre'),
      classified: hasAccessFollowupField(type, 'classified'),
      forwardedToJustice: hasAccessFollowupField(type, 'forwardedToJustice'),
      interventions: hasAccessFollowupField(type, 'interventions'),
      signalements: hasAccessFollowupField(type, 'signalements'),
      privateSynthesis: followup
        ? canEditFollowupPrivateSynthesis(user, followup)
        : true
    }
  }

  return Promise.resolve(permissions)
}

export const getFollowupPermissions = createQuery({
  inputValidation: idSchema.optional(),
  securityCheck: AllowSecurityCheck,
  handler
})
