import { FollowupMedium } from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper'
import { FollowupRepo } from '~/server/database'
import { EditFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import {
  connect,
  prepareDocumentsMutations,
  prepareDateFields
} from '~/utils/prisma'
import { markFollowupTypeAsUsed } from '~/server/query'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditFollowupInput
}

export const update = async ({ ctx, input }: UpdateParams) => {
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
