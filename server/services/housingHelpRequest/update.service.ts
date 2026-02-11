import type { Prisma } from '@prisma/client'
import { NotificationType } from '@prisma/client'
import { cleanUpdateInput } from './helper'
import {
  SocialSupportRepo,
  HousingHelpRequestRepo,
  FileInstructionRepo,
  NotificationRepo
} from '~/server/database'
import type { EditHousingHelpRequestInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
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
              id: true,
              beneficiaryId: true,
              createdById: true,
              documents: true,
              privateSynthesis: true,
              privateSynthesisRichText: true
            }
          }
        }
      }
    }
  })

  const {
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
    lowIncomeHousingType,
    isPmr
  } = cleanUpdateInput(input)

  const updateSocialSupport = () =>
    SocialSupportRepo.update(ctx.user, {
      where: { id: input.socialSupportId },
      data: {
        lastUpdatedBy: connect(ctx.user.id),
        status,
        synthesis,
        synthesisRichText,
        // only social support creator can update private synthesis. see FileInstructionPermissions
        // /server/security/permissions/getFileInstructionPermissions.ts
        privateSynthesis:
          ctx.user.id === target.fileInstruction.socialSupport.createdById
            ? privateSynthesis
            : target.fileInstruction.socialSupport.privateSynthesis,
        privateSynthesisRichText:
          ctx.user.id === target.fileInstruction.socialSupport.createdById
            ? privateSynthesisRichText
            : target.fileInstruction.socialSupport.privateSynthesisRichText,
        minister: isMinistry && ministerId ? connect(ministerId) : undefined,
        numeroPegase,
        dueDate,
        date,
        documents: prepareDocumentsMutations(
          documents,
          target.fileInstruction.socialSupport.documents
        )
      },
      include: {
        familyFile: {
          select: {
            id: true
          }
        }
      }
    })

  const updateFileInstruction = () =>
    FileInstructionRepo.prisma.update({
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
        instructorOrganizationId: instructorOrganizationId || undefined,
        instructorOrganizationContactId:
          instructorOrganizationContactId || undefined
      }
    })

  const updateHousingHelpRequest = () =>
    HousingHelpRequestRepo.prisma.update({
      where: { id: input.id },
      data: {
        isFirst,
        firstOpeningDate,
        reason,
        uniqueId,
        askedHousing,
        handlingDate,
        housingType: housingType || undefined,
        roomCount: roomCount || undefined,
        lowIncomeHousingType: lowIncomeHousingType || undefined,
        taxHouseholdAdditionalInformation,
        maxRent,
        maxCharges,
        isPmr,
        prescribingOrganization: prescribingOrganizationId
          ? connect(prescribingOrganizationId)
          : undefined,
        prescribingOrganizationContact: prescribingOrganizationContactId
          ? connect(prescribingOrganizationContactId)
          : undefined
      }
    })

  const transactions: (() => Prisma.PrismaPromise<any>)[] = [
    updateSocialSupport,
    updateFileInstruction,
    updateHousingHelpRequest
  ]
  if (ctx.user.id !== target.fileInstruction.socialSupport.createdById) {
    const createNotification = () =>
      NotificationRepo.prisma.create({
        data: {
          recipientId: target.fileInstruction.socialSupport.createdById,
          itemCreatedById: ctx.user.id,
          beneficiaryId: target.fileInstruction.socialSupport.beneficiaryId,
          socialSupportId: target.fileInstruction.socialSupport.id,
          type: NotificationType.UpdateFileInstructionElement
        }
      })
    transactions.push(createNotification)
  }

  const [socialSupportResult] = await prismaClient.$transaction(
    transactions.map(transaction => transaction())
  )

  return { helpRequest: socialSupportResult }
}
