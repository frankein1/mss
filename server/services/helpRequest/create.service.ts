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
import { prepareDocumentsMutations } from '~/utils/prisma'

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
      dueDate,
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
      socialSupport: {
        create: {
          status,
          createdById: ctx.user.id,
          beneficiaryId,
          structureId: ctx.structure.id,
          synthesis,
          privateSynthesis,
          ministre,
          numeroPegase,
          types: {
            connect: [{ id: typeId }]
          },
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
