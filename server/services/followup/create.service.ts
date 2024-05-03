import {
  FollowupMedium,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { prepareSocialSupportSubjectsMutations } from './helper'
import { BeneficiaryRepo, SocialSupportRepo } from '~/server/database'
import { AddFollowupInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { markSocialSupportSubjectAsUsed } from '~/server/query'

type CreateParams = {
  ctx: SecurityRuleContext
  input: AddFollowupInput
}

export const create = async ({ ctx, input }: CreateParams) => {
  const { structure, user } = ctx
  const {
    beneficiaryId,
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
    duration
  } = input

  let prescribingOrganization
  if (prescribingOrganizationId) {
    prescribingOrganization = connect(prescribingOrganizationId)
  }
  let prescribingOrganizationContact
  if (prescribingOrganizationContactId) {
    prescribingOrganizationContact = connect(prescribingOrganizationContactId)
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
      subjects: prepareSocialSupportSubjectsMutations(subjects),
      documents: prepareDocumentsMutations(documents),
      notifications: {
        createMany: {
          data: beneficiary.referents
            .filter(referent => referent.id !== user.id)
            .map(referent => ({
              beneficiaryId: beneficiary.id,
              recipientId: referent.id,
              type: NotificationType.NewFollowupElement,
              itemCreatedById: user.id
            }))
        }
      },
      ministre,
      numeroPegase,
      synthesis,
      privateSynthesis,
      dueDate,
      followup: {
        create: {
          prescribingOrganization,
          prescribingOrganizationContact,
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

  await markSocialSupportSubjectAsUsed(subjects)

  return fu
}
