import {
  FileInstructionType,
  NotificationType,
  SocialSupportType
} from '@prisma/client'
import { cleanCreateInput } from './helper'
import { FamilyFileRepo, HousingHelpRequestRepo } from '~~/server/database'
import type { CreateHousingHelpRequestInput } from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security/rules/types'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { randomUUID } from 'node:crypto'
import {
  resolveRedirectionReasonIds,
  resolveReasonId
} from '../redirection/helper'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateHousingHelpRequestInput
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
    documents,
    externalStructure,
    status,
    examinationDate,
    decisionDate,
    refusalReason,
    prescribingOrganizationId,
    prescribingOrganizationContactId,
    instructorOrganizationId,
    instructorOrganizationContactId,
    dispatchDate,
    handlingDate,
    synthesis,
    synthesisRichText,
    privateSynthesis,
    privateSynthesisRichText,
    dueDate,
    fullFile,
    endOfSocialSupport,
    date,
    housingType,
    isPmr,
    roomCount,
    lowIncomeHousingType,
    firstOpeningDate,
    isFirst,
    maxCharges,
    maxRent,
    reason,
    taxHouseholdAdditionalInformation,
    uniqueId,
    askedHousing
  } = cleanCreateInput(input)

  const reasonIds = await resolveRedirectionReasonIds(
    ctx,
    input.socialSupportRedirections
  )
  const redirectionData =
    input.socialSupportRedirections
      ?.map(r => {
        if (r.type) {
          return {
            id: r.id || randomUUID(),
            type: r.type,
            redirectionReasonId: resolveReasonId(
              reasonIds,
              r.redirectionReasonName
            ),
            externalStructureName: r.externalStructureName || null,
            partnerOrganizationId: r.partnerOrganizationId || null,
            partnerOrganizationContactId: r.partnerOrganizationContactId || null
          }
        }
      })
      .filter(r => r != null) || []

  const { id, fileInstruction } = await HousingHelpRequestRepo.prisma.create({
    data: {
      reason,
      housingType: housingType || undefined,
      isPmr,
      roomCount: roomCount || undefined,
      lowIncomeHousingType: lowIncomeHousingType || undefined,
      firstOpeningDate,
      isFirst,
      maxCharges,
      handlingDate,
      maxRent,
      prescribingOrganization: prescribingOrganizationId
        ? connect(prescribingOrganizationId)
        : undefined,
      prescribingOrganizationContact: prescribingOrganizationContactId
        ? connect(prescribingOrganizationContactId)
        : undefined,
      fileInstruction: {
        create: {
          type: FileInstructionType.Housing,
          examinationDate,
          decisionDate,
          refusalReason,
          dispatchDate,
          fullFile,
          externalStructure,
          instructorOrganization: instructorOrganizationId
            ? connect(instructorOrganizationId)
            : undefined,
          instructorOrganizationContact: instructorOrganizationContactId
            ? connect(instructorOrganizationContactId)
            : undefined,
          socialSupport: {
            create: {
              status,
              socialSupportType: SocialSupportType.HelpRequestHousing,
              subtype: FileInstructionType.Housing,
              createdById: ctx.user.id,
              familyFileId,
              beneficiaryId,
              structureId: ctx.structure.id,
              synthesis,
              synthesisRichText,
              privateSynthesis,
              privateSynthesisRichText,
              ministerId: input.isMinistry && ministerId ? ministerId : null,
              numeroPegase,
              endOfSocialSupport,
              dueDate,
              date,
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
      },
      taxHouseholdAdditionalInformation,
      uniqueId,
      askedHousing
    },
    select: {
      id: true,
      fileInstruction: {
        select: {
          socialSupportId: true
        }
      }
    }
  })

  return { id, socialSupportId: fileInstruction.socialSupportId }
}
