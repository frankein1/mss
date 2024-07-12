import {
  FileInstructionType,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { cleanCreateInput } from './helper'
import { FamilyFileRepo, HelpRequestRepo } from '~/server/database'
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
  const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.familyFileId },
    select: { id: true, referents: true }
  })

  const {
    familyFileId,
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
              familyFileId,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              privateSynthesis,
              ministre,
              numeroPegase,
              subjects: connect(subjectId),
              dueDate,
              documents: prepareDocumentsMutations(documents),
              notifications: {
                createMany: {
                  data: familyFile.referents
                    .filter(referent => referent.id !== ctx.user.id)
                    .map(referent => ({
                      familyFileId: familyFile.id,
                      recipientId: referent.id,
                      type: NotificationType.NewFileInstructionElement,
                      itemCreatedById: ctx.user.id
                    }))
                }
              }
            }
          }
        }
      }
    }
  })

  await markSocialSupportSubjectAsUsed([input.subjectId])

  return { helpRequest }
}
