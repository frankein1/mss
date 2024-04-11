import { FileInstructionType, SocialSupportType } from '@prisma/client'
import { prepareNewHistoryElementNotification } from '../helper'
import { cleanCreateInput } from './helper'
import { BeneficiaryRepo, HelpRequestRepo } from '~/server/database'
import { CreateHelpRequestInput } from '~/server/schema'
import { markSocialSupportSubjectAsUsed } from '~/server/query'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations, connect } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateHelpRequestInput
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
    financialSupport,
    isRefundable,
    date
  } = cleanCreateInput(input)

  const helpRequest = await HelpRequestRepo.prisma.create({
    data: {
      askedAmount,

      allocatedAmount,
      paymentMethod,
      paymentDate,
      handlingDate,
      financialSupport,
      prescribingOrganization: prescribingOrganizationId
        ? connect(prescribingOrganizationId)
        : undefined,
      prescribingOrganizationContact: prescribingOrganizationContactId
        ? connect(prescribingOrganizationContactId)
        : undefined,
      isRefundable,
      subject: connect(subjectId),
      fileInstruction: {
        create: {
          type: financialSupport
            ? FileInstructionType.Financial
            : FileInstructionType.Other,
          externalStructure,
          examinationDate,
          decisionDate,
          refusalReason,
          dispatchDate,
          fullFile,
          instructorOrganization: instructorOrganizationId
            ? connect(instructorOrganizationId)
            : undefined,
          instructorOrganizationContact: instructorOrganizationContactId
            ? connect(instructorOrganizationContactId)
            : undefined,
          socialSupport: {
            create: {
              date,
              status,
              socialSupportType: SocialSupportType.HelpRequest,
              createdById: ctx.user.id,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              privateSynthesis,
              ministre,
              numeroPegase,
              subjects: connect(subjectId),
              dueDate,
              documents: prepareDocumentsMutations(documents),
              notifications: prepareNewHistoryElementNotification(
                beneficiary,
                ctx.user
              )
            }
          }
        }
      }
    }
  })

  await markSocialSupportSubjectAsUsed([input.subjectId])

  return { helpRequest }
}
