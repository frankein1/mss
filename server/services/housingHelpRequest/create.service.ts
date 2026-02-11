import {
  FileInstructionType,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { cleanCreateInput } from './helper'
import { FamilyFileRepo, HousingHelpRequestRepo } from '~/server/database'
import type { CreateHousingHelpRequestInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'
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
    ministerId,
    isMinistry,
    documents,
    externalStructure,
    status,
    examinationDate,
    decisionDate,
    refusalReason,
    prescribingOrganizationId,
    prescribingOrganizationContactId,
    instructorOrganizationId,
    instructorOrganizationContactId,
    dispatchDate,
    handlingDate,
    synthesis,
    synthesisRichText,
    privateSynthesis,
    privateSynthesisRichText,
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

  const { id, fileInstruction } = await HousingHelpRequestRepo.prisma.create({
    data: {
      reason,
      housingType: housingType || undefined,
      isPmr,
      roomCount: roomCount || undefined,
      lowIncomeHousingType: lowIncomeHousingType || undefined,
      firstOpeningDate,
      isFirst,
      maxCharges,
      handlingDate,
      maxRent,
      prescribingOrganization: prescribingOrganizationId
        ? connect(prescribingOrganizationId)
        : undefined,
      prescribingOrganizationContact: prescribingOrganizationContactId
        ? connect(prescribingOrganizationContactId)
        : undefined,
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
              subtype: FileInstructionType.Housing,
              createdById: ctx.user.id,
              familyFileId,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              synthesisRichText,
              privateSynthesis,
              privateSynthesisRichText,
              minister:
                isMinistry && ministerId ? connect(ministerId) : undefined,
              numeroPegase,
              dueDate,
              date,
              documents: prepareDocumentsMutations(documents),
              notifications: {
                createMany: {
                  data: familyFile.referents
                    .filter(referent => referent.id !== ctx.user.id)
                    .map(referent => ({
                      beneficiaryId,
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
    },
    include: {
      fileInstruction: { select: { socialSupportId: true } }
    }
  })

  return { id, socialSupportId: fileInstruction.socialSupportId }
}
