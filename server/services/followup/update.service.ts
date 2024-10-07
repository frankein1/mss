import { FollowupMedium, NotificationType } from '@prisma/client'
import { SocialSupportSubjectService } from '..'
import { prepareSocialSupportSubjectsMutations } from './helper'
import {
  FollowupRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~/server/database'
import { EditFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditFollowupInput
}

export const update = async ({ ctx, input }: UpdateParams) => {
  const target = await SocialSupportRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.socialSupportId },
    select: {
      id: true,
      beneficiaryId: true,
      createdById: true,
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
    synthesisRichText,
    privateSynthesis,
    privateSynthesisRichText,
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
      lastUpdatedBy: connect(ctx.user.id),
      documents: prepareDocumentsMutations(documents, target.documents),
      subjects: prepareSocialSupportSubjectsMutations(
        subjects,
        target.subjects
      ),
      ministre,
      date,
      synthesis,
      synthesisRichText,
      privateSynthesis,
      privateSynthesisRichText,
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

  const transactions = []

  transactions.push(updateSocialSupport)
  transactions.push(updateFollowup)
  transactions.push(updateSocialSupportSubject)

  if (ctx.user.id !== target.createdById) {
    const createNotification = NotificationRepo.prisma.create({
      data: {
        recipientId: target.createdById,
        itemCreatedById: ctx.user.id,
        beneficiaryId: target.beneficiaryId,
        socialSupportId: target.id,
        type: NotificationType.UpdateFollowupElement
      }
    })
    transactions.push(createNotification)
  }

  const [socialSupportResult] = await prismaClient.$transaction(transactions)

  return socialSupportResult
}
