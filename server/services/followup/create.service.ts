import { FollowupMedium, SocialSupportType } from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper'
import { BeneficiaryRepo, SocialSupportRepo } from '~/server/database'
import { AddFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { markFollowupTypeAsUsed } from '~/server/query'
import { prepareNewHistoryElementNotification } from '~/server/services/helper'
import { isNewOption, newOptionToLabel } from '~/utils/options'

type CreateParams = {
  ctx: SecurityRuleContext
  input: AddFollowupInput
}

export const create = async ({ ctx, input }: CreateParams) => {
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
  } = input

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

  const fu = await SocialSupportRepo.prisma.create({
    data: {
      status,
      socialSupportType: SocialSupportType.Followup,
      date,
      structure: connect(structure.id),
      beneficiary: connect(beneficiaryId),
      createdBy: connect(user.id),
      types: prepareFollowupTypesMutations(types),
      documents: prepareDocumentsMutations(documents),
      notifications: prepareNewHistoryElementNotification(beneficiary, user),
      ministre,
      numeroPegase,
      synthesis,
      privateSynthesis,
      dueDate,
      followup: {
        create: {
          prescribingOrganization,
          redirected,
          structureName: redirected ? structureName : null,
          medium,
          place: medium === FollowupMedium.ExternalAppointment ? place : null,
          thirdPersonName:
            medium === FollowupMedium.ThirdParty ? thirdPersonName : null,
          helpRequested,
          firstFollowup,
          classified,
          forwardedToJustice
          // signalements,
          // interventions,
        }
      }
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
