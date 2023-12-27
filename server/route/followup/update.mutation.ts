import {
  FollowupMedium,
  UserActivityType
  // FollowupSignalement,
  // FollowupIntervention
} from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper/prepareFollowupData'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
import {
  SecurityRuleGrantee,
  canCreatePrescribingOrganization,
  canEditFollowup,
  canEditFollowupPrivateSynthesis
} from '~/server/security'

import {
  getFollowupSecurityTarget,
  markFollowupTypeAsUsed
} from '~/server/query'
import { FollowupRepo } from '~/server/database'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import {
  connect,
  prepareDocumentsMutations,
  prepareDateFields
} from '~/utils/prisma'

const handler = async ({
  input,
  ctx
}: {
  input: EditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx
  const {
    id,
    types,
    documents,
    medium,
    place,
    redirected,
    structureName,
    thirdPersonName,
    prescribingOrganizationId,
    ministre,
    date,
    synthesis,
    privateSynthesis,
    status,
    helpRequested,
    dueDate,
    firstFollowup,
    numeroPegase,
    classified,
    forwardedToJustice
    // ActionLogement,
    // Bailleur,
    // DeetsSiao,
    // Prefecture,
    // SecoursMedecinTraitant,
    // ChefCabinet,
    // OrganismeMenace,
    // Prefet
  } = prepareDateFields(input, ['dueDate'])

  // const interventionFields = {
  //   ActionLogement,
  //   Bailleur,
  //   DeetsSiao,
  //   Prefecture,
  //   SecoursMedecinTraitant
  // }

  // const interventions = Object.entries(interventionFields)
  //   .filter(([_key, value]) => !!value)
  //   .map(([key, _value]) => key as FollowupIntervention)

  // const signalementFields = {
  //   ChefCabinet,
  //   OrganismeMenace,
  //   Prefet
  // }

  // const signalements = Object.entries(signalementFields)
  //   .filter(([_key, value]) => !!value)
  //   .map(([key, _value]) => key as FollowupSignalement)

  let prescribingOrganization
  if (prescribingOrganizationId) {
    if (isNewOption(prescribingOrganizationId)) {
      prescribingOrganization = {
        create: {
          name: newOptionToLabel(prescribingOrganizationId || ''),
          structureId: user.structureId || '',
          createdById: user.id
        }
      }
    } else {
      prescribingOrganization = connect(prescribingOrganizationId)
    }
  }

  const fu = await FollowupRepo.prisma.update({
    where: {
      id
    },
    data: {
      // signalements,
      // interventions,
      prescribingOrganization,
      types: prepareFollowupTypesMutations(types),
      documents: prepareDocumentsMutations(documents),
      redirected,
      structureName: redirected ? structureName : null,
      medium,
      place: medium === FollowupMedium.ExternalAppointment ? place : null,
      thirdPersonName:
        medium === FollowupMedium.ThirdParty ? thirdPersonName : null,
      ministre,
      date,
      synthesis,
      privateSynthesis,
      status,
      helpRequested,
      dueDate,
      firstFollowup,
      numeroPegase,
      classified,
      forwardedToJustice
    },
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })

  await markFollowupTypeAsUsed(types)

  return fu
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditFollowupInput
) => {
  const target = await getFollowupSecurityTarget(user, input.id)
  // CAN EDIT FU
  if (!canEditFollowup(user, target)) {
    return false
  }
  if (
    isNewOption(input.prescribingOrganizationId) &&
    !canCreatePrescribingOrganization(user)
  ) {
    return false
  }

  // CAN EDIT PRIVATE SYNTHESIS
  if (
    input.privateSynthesis &&
    !canEditFollowupPrivateSynthesis(user, target)
  ) {
    return false
  }

  return true
}

export const updateFollowupMutation = createMutation({
  handler,
  inputValidation: editFollowupSchema,
  securityCheck,
  auditLog: {
    key: 'followup.update',
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
