import { cleanUpdateInput } from './helper'
import {
  SocialSupportRepo,
  HousingHelpRequestRepo,
  FileInstructionRepo
} from '~/server/database'
import { EditHousingHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations } from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHousingHelpRequestInput
}

export async function update({ input, ctx }: UpdateParams) {
  const target = await HousingHelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      fileInstruction: {
        select: {
          instructorOrganizationId: true,
          socialSupport: {
            select: {
              documents: true
            }
          }
        }
      }
    }
  })

  const {
    numeroPegase,
    ministre,
    documents,
    externalStructure,
    status,
    examinationDate,
    decisionDate,
    refusalReason,
    instructorOrganizationId,
    dispatchDate,
    synthesis,
    privateSynthesis,
    dueDate,
    fullFile,
    date,
    isFirst,
    firstOpeningDate,
    askedHousing,
    reason,
    uniqueId,
    taxHouseholdAdditionalInformation,
    maxRent,
    maxCharges,
    housingType,
    roomCount,
    isPmr
  } = cleanUpdateInput(input)

  const updateSocialSupport = SocialSupportRepo.update(ctx.user, {
    where: { id: input.socialSupportId },
    data: {
      status,
      synthesis,
      privateSynthesis,
      ministre,
      numeroPegase,
      dueDate,
      date,
      documents: prepareDocumentsMutations(
        documents,
        target.fileInstruction.socialSupport.documents
      )
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

  const updateFileInstruction = FileInstructionRepo.prisma.update({
    where: {
      socialSupportId: input.socialSupportId
    },
    data: {
      examinationDate,
      decisionDate,
      refusalReason,
      dispatchDate,
      fullFile,
      externalStructure,
      instructorOrganizationId: instructorOrganizationId || undefined
    }
  })

  const updateHousingHelpRequest = HousingHelpRequestRepo.prisma.update({
    where: { id: input.id },
    data: {
      isFirst,
      firstOpeningDate,
      reason,
      uniqueId,
      askedHousing,
      housingType: housingType || undefined,
      roomCount: roomCount || undefined,
      taxHouseholdAdditionalInformation,
      maxRent,
      maxCharges,
      isPmr
    }
  })

  const [socialSupportResult] = await prismaClient.$transaction([
    updateSocialSupport,
    updateFileInstruction,
    updateHousingHelpRequest
  ])

  return { helpRequest: socialSupportResult }
}
