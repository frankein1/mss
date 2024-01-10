import {
  cleanUpdateInput,
  prepareInstructorOrganization,
  preparePrescribingOrganization
} from './helper'
import { HelpRequestRepo } from '~/server/database'
import { markFollowupTypeAsUsed } from '~/server/query'
import { EditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations } from '~/utils/prisma'

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
  } = cleanUpdateInput({ input, subject: target.subject })

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id: input.id },
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
        input.externalStructure === 'true',
        target.instructorOrganizationId !== null
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
          documents: prepareDocumentsMutations(
            documents,
            target.socialSupport.documents
          )        }
      }
    },
    include: {
      socialSupport: {
        select: {
          beneficiary: {
            select: {
              id: true,
              fileNumber: true
            }
          }
        }
      }
    }
  })

  await markFollowupTypeAsUsed([input.typeId])

  return { helpRequest }
}
