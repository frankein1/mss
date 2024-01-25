import { prepareInstructorOrganization } from '../helper'
import { cleanUpdateInput } from './helper'
import { SocialSupportRepo, HousingHelpRequestRepo } from '~/server/database'
import { EditHousingHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations } from '~/utils/prisma'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHousingHelpRequestInput
}

export async function update({ input, ctx }: UpdateParams) {
  const target = await HousingHelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      instructorOrganizationId: true,
      socialSupport: {
        select: {
          documents: true
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

  const helpRequest = await SocialSupportRepo.update(ctx.user, {
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
        target.socialSupport.documents
      ),
      housingHelpRequest: {
        update: {
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
          isPmr,
          examinationDate,
          decisionDate,
          refusalReason,
          dispatchDate,
          fullFile,
          externalStructure,
          instructorOrganization: prepareInstructorOrganization(
            instructorOrganizationId,
            ctx,
            externalStructure,
            target.instructorOrganizationId !== null
          )
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

  return { helpRequest }
}
