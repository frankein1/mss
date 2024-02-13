import { FileInstructionType, SocialSupportType } from '@prisma/client'
import {
  prepareNewHistoryElementNotification,
  prepareInstructorOrganization
} from '../helper'
import { cleanCreateInput, preparePrescribingOrganization } from './helper'
import { BeneficiaryRepo, HelpRequestRepo } from '~/server/database'
import { CreateHelpRequestInput } from '~/server/schema'
import { markFollowupTypeAsUsed } from '~/server/query'
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
    typeId,
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
      prescribingOrganization: preparePrescribingOrganization(
        prescribingOrganizationId,
        ctx
      ),

      isRefundable,
      type: connect(typeId),
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
          instructorOrganization: prepareInstructorOrganization(
            instructorOrganizationId,
            ctx,
            externalStructure
          ),
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
              types: connect(typeId),
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

  await markFollowupTypeAsUsed([input.typeId])

  return { helpRequest }
}
