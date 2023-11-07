import {
  FollowupIntervention,
  FollowupMedium,
  FollowupSignalement,
  UserActivityType
} from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper/prepareFollowupData'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AddFollowupInput, addFollowupSchema } from '~/server/schema'
import {
  SecurityRuleGrantee,
  canCreateFollowup,
  canCreatePrescribingOrganization
} from '~/server/security/rules'

import { getBeneficiarySecurityTarget } from '~/server/query'
import { prepareDocumentsMutations } from '~/utils/prisma/prepareDocumentMutations'
import { FollowupRepo } from '~/server/database'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { hasAccessfollowupFields } from '~/security/permission'
import { getStructureByUser } from '~/server/query/structure'
import { connect } from '~/utils/prisma'

const handler = async ({
  input,
  ctx
}: {
  input: AddFollowupInput
  ctx: ProtectedAppContext
}) => {
  const { structure, user } = ctx
  const {
    beneficiaryId,
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

  const signalementFields = {
    ChefCabinet,
    OrganismeMenace,
    Prefet
  }
  const signalements = Object.entries(signalementFields)
    .filter(([_key, value]) => value != null)
    .map(([key, _value]) => key as FollowupSignalement)

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

  const fu = await FollowupRepo.prisma.create({
    data: {
      structure: connect(structure.id),
      beneficiary: connect(beneficiaryId),
      createdBy: connect(user.id),
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
  input: AddFollowupInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )
  if (!canCreateFollowup(user, beneficiary)) {
    return false
  }
  if (
    isNewOption(input.prescribingOrganizationId) &&
    !canCreatePrescribingOrganization(user)
  ) {
    return false
  }
  const { type } = await getStructureByUser(user)

  if (!hasAccessfollowupFields(type, Object.keys(input))) {
    return false
  }
  return true
}

export const createFollowupMutation = createMutation({
  inputValidation: addFollowupSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'followup.create',
    target: 'Followup',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
