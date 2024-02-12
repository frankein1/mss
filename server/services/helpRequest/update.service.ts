import { prepareInstructorOrganization } from '../helper'
import { cleanUpdateInput, preparePrescribingOrganization } from './helper'
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
      financialSupport: true,
      socialSupport: {
        select: {
          types: true,
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
    date,
    isRefundable
  } = cleanUpdateInput({ input, isFinancial: target.financialSupport })

  const helpRequest = await SocialSupportRepo.update(ctx.user, {
    where: { id: input.socialSupportId },
    data: {
      status,
      synthesis,
      privateSynthesis,
      ministre,
      numeroPegase,
      dueDate,
      date,
      types: {
        ...connect(typeId),
        disconnect: target.socialSupport.types.map(({ id }) => ({ id }))
      },
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
            externalStructure,
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
