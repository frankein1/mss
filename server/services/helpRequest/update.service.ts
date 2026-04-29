import type { Prisma } from '@prisma/client'
import { NotificationType } from '@prisma/client'
import { SocialSupportSubjectService } from '..'
import { cleanUpdateInput } from './helper'
import {
  SocialSupportRepo,
  HelpRequestRepo,
  FileInstructionRepo,
  NotificationRepo
} from '~/server/database'
import type { EditHelpRequestServerInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import {
  prepareDocumentsMutations,
  connect,
  prepareRelationUpdates
} from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'
import { filterOutEmptyElements } from '../helper'
import { getSocialSupportWithRedirections } from '../socialSupport/helper'
import { v4 } from 'uuid'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHelpRequestServerInput
}

export async function update({ input, ctx }: UpdateParams) {
  const target = await HelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      financialSupport: true,
      fileInstruction: {
        select: {
          instructorOrganizationId: true,
          socialSupport: {
            select: {
              id: true,
              beneficiaryId: true,
              createdById: true,
              subjects: true,
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
    subjectId,
    documents,
    socialSupportRedirections,
    externalStructure,
    status,
    askedAmount,
    examinationDate,
    decisionDate,
    allocatedAmount,
    paymentMethod,
    paymentDate,
    handlingDate,
    refusalReason,
    prescribingOrganizationId,
    prescribingOrganizationContactId,
    instructorOrganizationId,
    instructorOrganizationContactId,
    dispatchDate,
    synthesis,
    synthesisRichText,
    privateSynthesis,
    privateSynthesisRichText,
    dueDate,
    fullFile,
    date,
    isRefundable
  } = cleanUpdateInput({ input, isFinancial: target.financialSupport })
  const disconnectSubject = target.fileInstruction.socialSupport.subjects
    .filter(s => s.id !== subjectId)
    .map(({ id }) => ({ id }))

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
          partnerOrganizationContactId: r.partnerOrganizationContactId
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
        subjects: {
          ...connect(subjectId),
          disconnect: disconnectSubject
        },
        documents: prepareDocumentsMutations(
          documents,
          target.fileInstruction.socialSupport.documents
        ),
        socialSupportRedirections: prepareRedirections
          ? prepareRelationUpdates(prepareRedirections, previousRedirectionIds)
          : undefined
      },
      select: {
        id: true
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
        instructorOrganizationId: instructorOrganizationId || null,
        instructorOrganizationContactId: instructorOrganizationContactId || null
      },
      select: {
        id: true
      }
    })

  const updateHelpRequest = () =>
    HelpRequestRepo.prisma.update({
      where: { id: input.id },
      data: {
        askedAmount,
        allocatedAmount,
        paymentMethod,
        paymentDate,
        handlingDate,
        isRefundable,
        subjectId,
        prescribingOrganizationId: prescribingOrganizationId || null,
        prescribingOrganizationContactId:
          prescribingOrganizationContactId || null
      },
      select: {
        id: true
      }
    })

  const updateSocialSupportSubject = () =>
    SocialSupportSubjectService.markUsed(ctx, [subjectId])

  const transactions: (() => Prisma.PrismaPromise<any>)[] = [
    updateSocialSupport,
    updateFileInstruction,
    updateHelpRequest,
    updateSocialSupportSubject
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
