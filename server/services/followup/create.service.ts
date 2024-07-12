import {
  FollowupMedium,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { prepareSocialSupportSubjectsMutations } from './helper'
import { FamilyFileRepo, SocialSupportRepo } from '~/server/database'
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
    familyFileId,
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

  const familyFile = await FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id: familyFileId },
    include: { referents: true }
  })

  const fu = await SocialSupportRepo.prisma.create({
    data: {
      status,
      socialSupportType: SocialSupportType.Followup,
      date,
      structure: connect(structure.id),
      familyFile: connect(familyFileId),
      beneficiary: connect(beneficiaryId),
      createdBy: connect(user.id),
      subjects: prepareSocialSupportSubjectsMutations(subjects),
      documents: prepareDocumentsMutations(documents),
      notifications: {
        createMany: {
          data: familyFile.referents
            .filter(referent => referent.id !== user.id)
            .map(referent => ({
              familyFileId: familyFile.id,
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
      familyFile: {
        select: {
          id: true
        }
      }
    }
  })

  await markSocialSupportSubjectAsUsed(subjects)

  return fu
}
