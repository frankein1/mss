import { FollowupMedium } from '@prisma/client'
import { prepareFollowupTypesMutations } from './helper'
import { SocialSupportRepo } from '~/server/database'
import { EditFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { markFollowupTypeAsUsed } from '~/server/query'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditFollowupInput
}

export const update = async ({ ctx, input }: UpdateParams) => {
  const target = await SocialSupportRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.socialSupportId },
    select: {
      documents: true,
      types: true
    }
  })

  const {
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
    socialSupportId,
    duration
  } = input

  let prescribingOrganization
  if (prescribingOrganizationId) {
    prescribingOrganization = connect(prescribingOrganizationId)
  }

  const fu = await SocialSupportRepo.update(ctx.user, {
    where: {
      id: socialSupportId
    },
    data: {
      documents: prepareDocumentsMutations(documents, target.documents),
      types: prepareFollowupTypesMutations(types, target.types),
      ministre,
      date,
      synthesis,
      privateSynthesis,
      status,
      numeroPegase,
      dueDate,
      followup: {
        update: {
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
