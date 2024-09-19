import { SocialSupportSubjectService } from '..'
import { cleanUpdateInput } from './helper'
import {
  SocialSupportRepo,
  HelpRequestRepo,
  FileInstructionRepo,
  NotificationRepo
} from '~/server/database'
import { EditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations, connect } from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'
import { NotificationType } from '@prisma/client'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHelpRequestInput
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
    subjectId,
    documents,
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
    privateSynthesis,
    dueDate,
    fullFile,
    date,
    isRefundable
  } = cleanUpdateInput({ input, isFinancial: target.financialSupport })

  const disconnectSubject = target.fileInstruction.socialSupport.subjects
    .filter(s => s.id !== subjectId)
    .map(({ id }) => ({ id }))

  const updateSocialSupport = SocialSupportRepo.update(ctx.user, {
    where: { id: input.socialSupportId },
    data: {
      lastUpdatedBy: connect(ctx.user.id),
      status,
      synthesis,
      privateSynthesis,
      ministre,
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
      instructorOrganizationId: instructorOrganizationId || null,
      instructorOrganizationContactId: instructorOrganizationContactId || null
    }
  })

  const updateHelpRequest = HelpRequestRepo.prisma.update({
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
      prescribingOrganizationContactId: prescribingOrganizationContactId || null
    }
  })

  const updateSocialSupportSubject = SocialSupportSubjectService.markUsed([
    subjectId
  ])

  const transactions = []

  transactions.push(updateSocialSupport)
  transactions.push(updateFileInstruction)
  transactions.push(updateHelpRequest)
  transactions.push(updateSocialSupportSubject)

  if (ctx.user.id !== target.fileInstruction.socialSupport.createdById) {
    const createNotification = NotificationRepo.prisma.create({
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

  const [socialSupportResult] = await prismaClient.$transaction(transactions)

  return { helpRequest: socialSupportResult }
}
