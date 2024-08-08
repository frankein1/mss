import { FollowupMedium } from '@prisma/client'
import { prepareSocialSupportSubjectsMutations } from './helper'
import { FollowupRepo, SocialSupportRepo } from '~/server/database'
import { EditFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { prepareDocumentsMutations } from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'
import { SocialSupportSubjectService } from '..'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditFollowupInput
}

export const update = async ({ ctx, input }: UpdateParams) => {
  const target = await SocialSupportRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.socialSupportId },
    select: {
      documents: true,
      subjects: true
    }
  })

  const {
    subjects,
    documents,
    medium,
    place,
    redirected,
    structureName,
    thirdPersonName,
    prescribingOrganizationId,
    prescribingOrganizationContactId,
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

  const updateSocialSupport = SocialSupportRepo.update(ctx.user, {
    where: { id: socialSupportId },
    data: {
      documents: prepareDocumentsMutations(documents, target.documents),
      subjects: prepareSocialSupportSubjectsMutations(
        subjects,
        target.subjects
      ),
      ministre,
      date,
      synthesis,
      privateSynthesis,
      status,
      numeroPegase,
      dueDate
    },
    include: {
      familyFile: {
        select: {
          id: true
        }
      }
    }
  })

  const updateFollowup = FollowupRepo.update(ctx.user, {
    where: { id: input.id },
    data: {
      prescribingOrganizationId: prescribingOrganizationId || null,
      prescribingOrganizationContactId:
        prescribingOrganizationContactId || null,
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
  })

  const updateSocialSupportSubject =
    SocialSupportSubjectService.markUsed(subjects)

  const [socialSupportResult] = await prismaClient.$transaction([
    updateSocialSupport,
    updateFollowup,
    updateSocialSupportSubject
  ])

  return socialSupportResult
}
