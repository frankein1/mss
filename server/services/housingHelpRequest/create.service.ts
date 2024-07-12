import {
  FileInstructionType,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { cleanCreateInput } from './helper'
import { FamilyFileRepo, HousingHelpRequestRepo } from '~/server/database'
import { CreateHousingHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateHousingHelpRequestInput
  target?: undefined
}

export async function create({ input, ctx }: CreateParams) {
  const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.familyFileId },
    select: { id: true, referents: true }
  })

  const {
    familyFileId,
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
    lowIncomeHousingType,
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
      lowIncomeHousingType: lowIncomeHousingType || undefined,
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
              familyFileId,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              privateSynthesis,
              ministre,
              numeroPegase,
              dueDate,
              date,
              documents: prepareDocumentsMutations(documents),
              notifications: {
                createMany: {
                  data: familyFile.referents
                    .filter(referent => referent.id !== ctx.user.id)
                    .map(referent => ({
                      familyFileId: familyFile.id,
                      recipientId: referent.id,
                      type: NotificationType.NewFileInstructionElement,
                      itemCreatedById: ctx.user.id
                    }))
                }
              }
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
