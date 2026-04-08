import type { Prisma } from '@prisma/client'
import {
  filterFileInstruction,
  filterHousingHelpRequest,
  filterSocialSupport
} from '../helper'
import { HousingHelpRequestRepo } from '~/server/database'
import type {
  AppContextPermissions,
  FileInstructionPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import {
  getAppContextPermissions,
  getFileInstructionPermissions
} from '~/server/security'

export const select = {
  id: true,
  reason: true,
  isFirst: true,
  firstOpeningDate: true,
  askedHousing: true,
  uniqueId: true,
  taxHouseholdAdditionalInformation: true,
  maxRent: true,
  maxCharges: true,
  handlingDate: true,
  housingType: true,
  roomCount: true,
  isPmr: true,
  lowIncomeHousingType: true,
  prescribingOrganizationId: true,
  prescribingOrganizationContactId: true,
  prescribingOrganization: {
    select: { id: true, name: true }
  },
  prescribingOrganizationContact: {
    select: { id: true, name: true }
  },
  fileInstruction: {
    select: {
      id: true,
      type: true,
      fullFile: true,
      decisionDate: true,
      dispatchDate: true,
      examinationDate: true,
      externalStructure: true,
      instructorOrganizationId: true,
      instructorOrganizationContactId: true,
      refusalReason: true,
      refusalReasonOther: true,
      instructorOrganization: {
        select: { id: true, name: true }
      },
      instructorOrganizationContact: {
        select: { id: true, name: true }
      },
      socialSupport: {
        select: {
          id: true,
          socialSupportType: true,
          subtype: true,
          date: true,
          structureId: true,
          created: true,
          updated: true,
          status: true,
          familyFileId: true,
          beneficiaryId: true,
          createdById: true,
          lastUpdatedById: true,
          dueDate: true,
          privateSynthesis: true,
          privateSynthesisRichText: true,
          synthesis: true,
          synthesisRichText: true,
          ministerId: true,
          numeroPegase: true,
          createdBy: {
            select: { id: true, firstName: true, lastName: true }
          },
          lastUpdatedBy: {
            select: { id: true, firstName: true, lastName: true }
          },
          subjects: true,
          minister: true,
          beneficiary: {
            select: {
              id: true,
              usualName: true,
              firstName: true,
              birthName: true,
              birthDate: true
            }
          },
          familyFile: {
            select: {
              id: true,
              structureId: true,
              referents: true
            }
          },
          documents: {
            select: { key: true, name: true }
          },
          socialSupportRedirections: {
            select: {
              id: true,
              type: true,
              motif: true,
              externalStructureName: true,
              partnerOrganizationId: true,
              partnerOrganizationContactId: true,
              partnerOrganization: { select: { name: true } },
              partnerOrganizationContact: { select: { name: true } }
            }
          }
        }
      }
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return HousingHelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    select
  })
}

type HousingHelpRequestOutput = NonNullable<
  Prisma.PromiseReturnType<typeof findOne>
>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const housingHelpRequest = await findOne(ctx.user, id)
  const {
    fileInstruction: { socialSupport }
  } = housingHelpRequest
  const { familyFile } = socialSupport
  const permissions = getFileInstructionPermissions({
    ctx,
    familyFile,
    socialSupport
  })
  const appPermissions = getAppContextPermissions(ctx)
  return {
    housingHelpRequest: filter(appPermissions, permissions, housingHelpRequest),
    permissions
  }
}

export function filter(
  appPermissions: AppContextPermissions,
  permissions: FileInstructionPermissions,
  housingHelpRequest: HousingHelpRequestOutput
) {
  const { fileInstruction } = housingHelpRequest
  const { socialSupport } = fileInstruction

  const conditions = {
    details: permissions.get.details,
    minister: appPermissions.module.ministere,
    privateSynthesis: permissions.get.privateSynthesis
  }
  const filteredSocialSupport = filterSocialSupport({
    socialSupport,
    conditions
  })
  const filteredFileInstruction = filterFileInstruction({
    fileInstruction,
    conditions
  })
  const filteredHousingHelpRequest = filterHousingHelpRequest({
    housingHelpRequest,
    conditions
  })

  // Attached document names are visible for all roles that can access the followup
  const documentNames = socialSupport.documents.map(d => ({
    key: d.key,
    name: d.name
  }))

  return {
    ...filteredHousingHelpRequest,
    fileInstruction: {
      ...filteredFileInstruction,
      socialSupport: {
        ...filteredSocialSupport,
        documents: documentNames
      }
    }
  }
}
