import { FileInstructionType, SocialSupportType } from '@prisma/client'
import { prepareNewHistoryElementNotification } from '../helper'
import { cleanCreateInput } from './helper'
import { BeneficiaryRepo, HousingHelpRequestRepo } from '~/server/database'
import { CreateHousingHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateHousingHelpRequestInput
  target?: undefined
}

export async function create({ input, ctx }: CreateParams) {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: { id: true, referents: true }
  })

  const {
    beneficiaryId,
    numeroPegase,
    ministre,
    documents,
    externalStructure,
    status,
    examinationDate,
    decisionDate,
    refusalReason,
    instructorOrganizationId,
    instructorOrganizationContactId,
    dispatchDate,
    synthesis,
    privateSynthesis,
    dueDate,
    fullFile,
    date,
    housingType,
    isPmr,
    roomCount,
    firstOpeningDate,
    isFirst,
    maxCharges,
    maxRent,
    reason,
    taxHouseholdAdditionalInformation,
    uniqueId,
    askedHousing
  } = cleanCreateInput(input)

  const { id } = await HousingHelpRequestRepo.prisma.create({
    data: {
      reason,
      housingType: housingType || undefined,
      isPmr,
      roomCount: roomCount || undefined,
      firstOpeningDate,
      isFirst,
      maxCharges,
      maxRent,
      fileInstruction: {
        create: {
          type: FileInstructionType.Housing,
          examinationDate,
          decisionDate,
          refusalReason,
          dispatchDate,
          fullFile,
          externalStructure,
          instructorOrganization: instructorOrganizationId
            ? connect(instructorOrganizationId)
            : undefined,
          instructorOrganizationContact: instructorOrganizationContactId
            ? connect(instructorOrganizationContactId)
            : undefined,
          socialSupport: {
            create: {
              status,
              socialSupportType: SocialSupportType.HelpRequestHousing,
              createdById: ctx.user.id,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              privateSynthesis,
              ministre,
              numeroPegase,
              dueDate,
              date,
              documents: prepareDocumentsMutations(documents),
              notifications: prepareNewHistoryElementNotification(
                beneficiary,
                ctx.user
              )
            }
          }
        }
      },

      taxHouseholdAdditionalInformation,
      uniqueId,
      askedHousing
    }
  })

  return { id }
}
