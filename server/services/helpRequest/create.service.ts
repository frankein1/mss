import {
  FileInstructionType,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { SocialSupportSubjectService } from '..'
import { cleanCreateInput } from './helper'
import { FamilyFileRepo, HelpRequestRepo } from '~/server/database'
import type { CreateHelpRequestInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareDocumentsMutations, connect } from '~/utils/prisma'
import { v4 } from 'uuid'

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
    ministerId,
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
    synthesisRichText,
    privateSynthesis,
    privateSynthesisRichText,
    dueDate,
    fullFile,
    financialSupport,
    isRefundable,
    date
  } = cleanCreateInput(input)

  const redirectionData =
    input.socialSupportRedirections
      ?.map(r => {
        if (r.type) {
          return {
            id: r.id || v4(),
            type: r.type,
            motif: r.motif || null,
            externalStructureName: r.externalStructureName || null,
            partnerOrganizationId: r.partnerOrganizationId || null,
            partnerOrganizationContactId: r.partnerOrganizationContactId || null
          }
        }
      })
      .filter(r => r != null) || []

  const { id, fileInstruction } = await HelpRequestRepo.prisma.create({
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
              subtype: financialSupport
                ? FileInstructionType.Financial
                : FileInstructionType.Other,
              createdById: ctx.user.id,
              familyFileId,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              synthesisRichText,
              privateSynthesis,
              privateSynthesisRichText,
              ministerId,
              numeroPegase,
              subjects: connect(subjectId),
              dueDate,
              documents: prepareDocumentsMutations(documents),
              socialSupportRedirections: {
                createMany: {
                  data: redirectionData
                }
              },
              notifications: {
                createMany: {
                  data: familyFile.referents
                    .filter(referent => referent.id !== ctx.user.id)
                    .map(referent => ({
                      beneficiaryId,
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
    },
    include: {
      fileInstruction: { select: { socialSupportId: true } }
    }
  })

  await SocialSupportSubjectService.markUsed(ctx, [input.subjectId])

  return { id, socialSupportId: fileInstruction.socialSupportId }
}
