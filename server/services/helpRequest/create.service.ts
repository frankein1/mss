import { SocialSupportType } from '@prisma/client'
import { prepareNewHistoryElementNotification } from '../helper'
import {
  cleanCreateInput,
  prepareInstructorOrganization,
  preparePrescribingOrganization
} from './helper'
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
    subject
  } = cleanCreateInput(input)

  const helpRequest = await HelpRequestRepo.prisma.create({
    data: {
      askedAmount,
      examinationDate,
      decisionDate,
      allocatedAmount,
      paymentMethod,
      paymentDate,
      handlingDate,
      refusalReason,
      dispatchDate,
      fullFile,
      subject,
      externalStructure,
      prescribingOrganization: preparePrescribingOrganization(
        prescribingOrganizationId,
        ctx
      ),
      instructorOrganization: prepareInstructorOrganization(
        instructorOrganizationId,
        ctx,
        input.externalStructure === 'true'
      ),
      type: connect(typeId),
      socialSupport: {
        create: {
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
  })

  await markFollowupTypeAsUsed([input.typeId])

  return { helpRequest }
}
