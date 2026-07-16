import type { Prisma } from '@prisma/client'
import {
  filterFileInstruction,
  filterHelpRequest,
  filterSocialSupport,
  filterHousingHelpRequest
} from '../helper'
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
import { FileInstructionRepo } from '~/server/database/repository/FileInstructionRepository'

function findMany(
  user: SecurityRuleGrantee,
  args: Omit<Prisma.FileInstructionFindManyArgs, 'select' | 'include'>
) {
  return FileInstructionRepo.findMany(user, {
    where: args.where,
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
      instructorOrganization: { select: { id: true, name: true } },
      instructorOrganizationContact: { select: { id: true, name: true } },
      socialSupport: {
        select: {
          id: true,
          socialSupportType: true,
          subtype: true,
          date: true,
          structureId: true,
          created: true,
          createdById: true,
          lastUpdatedById: true,
          updated: true,
          status: true,
          familyFileId: true,
          beneficiaryId: true,
          dueDate: true,
          privateSynthesis: true,
          privateSynthesisRichText: true,
          synthesis: true,
          synthesisRichText: true,
          ministerId: true,
          numeroPegase: true,
          endOfSocialSupport: true,
          lastUpdatedBy: {
            select: { id: true, firstName: true, lastName: true }
          },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          subjects: true,
          documents: { select: { key: true, name: true } },
          familyFile: {
            select: {
              id: true,
              structureId: true,
              referents: true
            }
          },
          beneficiary: {
            select: {
              id: true,
              fileNumber: true,
              usualName: true,
              firstName: true,
              birthName: true,
              birthDate: true,
              birthPlace: true
            }
          },
          minister: true,
          socialSupportRedirections: {
            select: {
              id: true,
              type: true,
              externalStructureName: true,
              partnerOrganizationId: true,
              partnerOrganizationContactId: true,
              partnerOrganization: { select: { name: true } },
              partnerOrganizationContact: { select: { name: true } },
              redirectionReason: { select: { name: true } }
            }
          }
        }
      },
      helpRequest: {
        select: {
          id: true,
          financialSupport: true,
          allocatedAmount: true,
          askedAmount: true,
          isRefundable: true,
          handlingDate: true,
          paymentDate: true,
          paymentMethod: true,
          prescribingOrganizationId: true,
          prescribingOrganizationContactId: true,
          prescribingOrganization: { select: { id: true, name: true } },
          prescribingOrganizationContact: { select: { id: true, name: true } }
        }
      },
      housingHelpRequest: {
        select: {
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
          prescribingOrganization: { select: { id: true, name: true } },
          prescribingOrganizationContact: { select: { id: true, name: true } }
        }
      }
    },
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
}

type FileInstructionOutput = NonNullable<
  Prisma.PromiseReturnType<typeof findMany>
>[0]

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.FileInstructionFindManyArgs, 'select' | 'include'>
) {
  const fileInstructions = await findMany(ctx.user, args)
  return fileInstructions.map(fileInstruction => {
    const { socialSupport } = fileInstruction
    const { familyFile } = socialSupport
    const permissions = getFileInstructionPermissions({
      ctx,
      familyFile,
      socialSupport
    })
    const appPermissions = getAppContextPermissions(ctx)
    return filter(appPermissions, permissions, fileInstruction)
  })
}

export function filter(
  appPermissions: AppContextPermissions,
  permissions: FileInstructionPermissions,
  fileInstruction: FileInstructionOutput
) {
  const { socialSupport, helpRequest, housingHelpRequest } = fileInstruction

  const conditions = {
    details: permissions.get.details,
    minister: appPermissions.module.ministere,
    privateSynthesis: permissions.get.privateSynthesis
  }
  const filteredSocialSupport = filterSocialSupport({
    socialSupport,
    conditions
  })
  let filteredHelpRequest = null
  if (helpRequest) {
    filteredHelpRequest = filterHelpRequest({
      helpRequest,
      conditions
    })
  }
  let filteredHousingHelpRequest = null
  if (housingHelpRequest) {
    filteredHousingHelpRequest = filterHousingHelpRequest({
      housingHelpRequest,
      conditions
    })
  }

  const filteredFileInstruction = filterFileInstruction({
    fileInstruction,
    conditions
  })

  // Attached document names are visible for all roles that can access the followup
  const documentNames = socialSupport.documents.map(d => ({
    key: d.key,
    name: d.name
  }))

  return {
    ...filteredFileInstruction,
    socialSupport: {
      ...filteredSocialSupport,
      documents: documentNames
    },
    helpRequest: filteredHelpRequest,
    housingHelpRequest: filteredHousingHelpRequest
  }
}
