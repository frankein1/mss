import {
  cleanUpdateInput,
  prepareInstructorOrganization,
  preparePrescribingOrganization
} from './helper'
import { SocialSupportRepo, HelpRequestRepo } from '~/server/database'
import { markFollowupTypeAsUsed } from '~/server/query'
import { EditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations, connect } from '~/utils/prisma'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHelpRequestInput
}

export async function update({ input, ctx }: UpdateParams) {
  const target = await HelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      instructorOrganizationId: true,
      subject: true,
      socialSupport: {
        select: {
          documents: true
        }
      }
    }
  })

  const {
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
    subject,
    date,
    isRefundable
  } = cleanUpdateInput({ input, subject: target.subject })

  const helpRequest = await SocialSupportRepo.prisma.update({
    where: { id: input.socialSupportId },
    data: {
      status,
      synthesis,
      privateSynthesis,
      ministre,
      numeroPegase,
      dueDate,
      date,
      types: connect(typeId),
      documents: prepareDocumentsMutations(
        documents,
        target.socialSupport.documents
      ),
      helpRequest: {
        update: {
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
          isRefundable,
          type: connect(typeId),
          prescribingOrganization: preparePrescribingOrganization(
            prescribingOrganizationId,
            ctx
          ),
          instructorOrganization: prepareInstructorOrganization(
            instructorOrganizationId,
            ctx,
            input.externalStructure === 'true',
            target.instructorOrganizationId !== null
          )
        }
      }
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

  await markFollowupTypeAsUsed([typeId])

  return { helpRequest }
}
