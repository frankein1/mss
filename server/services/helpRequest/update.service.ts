import { cleanUpdateInput } from './helper'
import {
  SocialSupportRepo,
  HelpRequestRepo,
  FileInstructionRepo
} from '~/server/database'
import { markSocialSupportSubjectAsUsed } from '~/server/query'
import { EditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations, connect } from '~/utils/prisma'
import { prismaClient } from '~/server/prisma'

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
    instructorOrganizationId,
    dispatchDate,
    synthesis,
    privateSynthesis,
    dueDate,
    fullFile,
    date,
    isRefundable
  } = cleanUpdateInput({ input, isFinancial: target.financialSupport })

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
      subjects: {
        ...connect(subjectId),
        disconnect: target.fileInstruction.socialSupport.subjects.map(
          ({ id }) => ({ id })
        )
      },
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
      instructorOrganizationId: instructorOrganizationId || null
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
      prescribingOrganizationId: prescribingOrganizationId || null
    }
  })

  const updateSocialSupportSubject = markSocialSupportSubjectAsUsed([subjectId])

  const [socialSupportResult] = await prismaClient.$transaction([
    updateSocialSupport,
    updateFileInstruction,
    updateHelpRequest,
    updateSocialSupportSubject
  ])

  return { helpRequest: socialSupportResult }
}
