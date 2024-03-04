import { FollowupMedium, SocialSupportType } from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper'
import { BeneficiaryRepo, SocialSupportRepo } from '~/server/database'
import { AddFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { markFollowupTypeAsUsed } from '~/server/query'
import { prepareNewHistoryElementNotification } from '~/server/services/helper'

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
    forwardedToJustice,
    duration
  } = input

  let prescribingOrganization
  if (prescribingOrganizationId) {
    prescribingOrganization = connect(prescribingOrganizationId)
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
          forwardedToJustice,
          duration
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
