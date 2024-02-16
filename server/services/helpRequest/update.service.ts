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
      financialSupport: true,
      fileInstruction: {
        select: {
          instructorOrganizationId: true,
          socialSupport: {
            select: {
              types: true,
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
        disconnect: target.fileInstruction.socialSupport.types.map(
          ({ id }) => ({ id })
        )
      },
      documents: prepareDocumentsMutations(
        documents,
        target.fileInstruction.socialSupport.documents
      ),
      fileInstruction: {
        update: {
          examinationDate,
          decisionDate,
          refusalReason,
          dispatchDate,
          fullFile,
          externalStructure,
          instructorOrganization: prepareInstructorOrganization(
            instructorOrganizationId,
            ctx,
            externalStructure
          ),
          helpRequest: {
            update: {
              askedAmount,
              allocatedAmount,
              paymentMethod,
              paymentDate,
              handlingDate,
              isRefundable,
              type: connect(typeId),
              prescribingOrganization: preparePrescribingOrganization(
                prescribingOrganizationId
              )
            }
          }
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
