import {
  // FollowupIntervention,
  FollowupMedium,
  // FollowupSignalement,
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
} from '~/server/security'
import { markFollowupTypeAsUsed } from '~/server/query'
import { FollowupRepo, BeneficiaryRepo } from '~/server/database'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import {
  connect,
  prepareDocumentsMutations,
  prepareDateFields
} from '~/utils/prisma'
import { BeneficiaryService } from '~/server/services'
import { prepareNewHistoryElementNotification } from '~/utils/notification'

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

  // const signalementFields = {
  //   ChefCabinet,
  //   OrganismeMenace,
  //   Prefet
  // }
  // const signalements = Object.entries(signalementFields)
  //   .filter(([_key, value]) => !!value)
  //   .map(([key, _value]) => key as FollowupSignalement)

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

  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id: beneficiaryId },
    include: { referents: true }
  })

  const fu = await FollowupRepo.prisma.create({
    data: {
      structure: connect(structure.id),
      beneficiary: connect(beneficiaryId),
      createdBy: connect(user.id),
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
      forwardedToJustice,
      notifications: prepareNewHistoryElementNotification(beneficiary, user)
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
  input: AddFollowupInput
) => {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
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
