import {
  FollowupMedium,
  UserActivityType,
  FollowupSignalement,
  FollowupIntervention
} from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper/prepareFollowupData'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'

import { getStructureByUser } from '~/server/query'
import { hasAccessfollowupFields } from '~/security/permission'
import { FollowupRepo } from '~/server/database'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { appRouter } from '~/server/trpc/routers'

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
    forwardedToJustice,
    ActionLogement,
    Bailleur,
    DeetsSiao,
    Prefecture,
    SecoursMedecinTraitant,
    ChefCabinet,
    OrganismeMenace,
    Prefet
  } = input

  const interventionFields = {
    ActionLogement,
    Bailleur,
    DeetsSiao,
    Prefecture,
    SecoursMedecinTraitant
  }

  const interventions = Object.entries(interventionFields)
    .filter(([_key, value]) => value != null)
    .map(([key, _value]) => key as FollowupIntervention)

  const signalementFields = {
    ChefCabinet,
    OrganismeMenace,
    Prefet
  }

  const signalements = Object.entries(signalementFields)
    .filter(([_key, value]) => value != null)
    .map(([key, _value]) => key as FollowupSignalement)

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
      signalements,
      interventions,
      prescribingOrganization,
      types: prepareFollowupTypesMutations(types),
      documents: prepareDocumentsMutations(documents),
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

  return fu
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditFollowupInput
) => {
  const caller = appRouter.createCaller({})
  const permissions = await caller.permissions.getFollowupPermissions({
    beneficiaryId: input.beneficiaryId,
    targetId: input.id
  })

  const { actions, fields } = permissions
  const { edit, createPrescribingOrga } = actions

  if (!edit) {
    return false
  }
  if (isNewOption(input.prescribingOrganizationId) && !createPrescribingOrga) {
    return false
  }
  // CAN ACCESS ALL UPDATED FIELDS
  const { type } = await getStructureByUser(user)
  if (!hasAccessfollowupFields(type, Object.keys(input))) {
    return false
  }

  // CAN EDIT PRIVATE SYNTHESIS
  if (input.privateSynthesis && !fields.privateSynthesis) {
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
