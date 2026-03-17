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
import {
  connect,
  prepareDocumentsMutations,
  prepareRelationUpdates
} from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'
import { getSocialSupportWithRedirections } from '../socialSupport/helper'
import { filterOutEmptyElements } from '../helper'
import { v4 } from 'uuid'

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
              socialSupportRedirections: true,
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
    socialSupportRedirections,
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

  const { socialSupportRedirections: previousRedirectionIds } =
    await getSocialSupportWithRedirections(ctx.user, input.socialSupportId)

  const prepareRedirections = socialSupportRedirections
    ?.map(r => {
      if (r.type) {
        return {
          id: r.id || v4(),
          type: r.type,
          motif: r.motif,
          externalStructureName: r.externalStructureName,
          partnerOrganizationId: r.partnerOrganizationId,
          partnerOrganizationContactId: r.partnerOrganizationContactId,
          createdAt: new Date()
        }
      }
    })
    .filter(r => r != null)
    .filter(filterOutEmptyElements)

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
        ),
        socialSupportRedirections: prepareRedirections
          ? prepareRelationUpdates(prepareRedirections, previousRedirectionIds)
          : undefined
      },
      select: {
        id: true,
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
      },
      select: {
        id: true
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
      },
      select: {
        id: true
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
        },
        select: {
          id: true
        }
      })
    transactions.push(createNotification)
  }

  const [socialSupportResult] = await prismaClient.$transaction(
    transactions.map(transaction => transaction())
  )

  return { id: socialSupportResult.id }
}
