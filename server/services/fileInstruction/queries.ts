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
    include: {
      instructorOrganization: true,
      instructorOrganizationContact: true,
      socialSupport: {
        include: {
          lastUpdatedBy: true,
          subjects: true,
          documents: true,
          familyFile: {
            include: {
              referents: true
            }
          },
          beneficiary: {
            select: {
              id: true,
              usualName: true,
              firstName: true,
              birthName: true,
              birthDate: true,
              birthPlace: true
            }
          },
          minister: true,
          createdBy: true,
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
      },
      helpRequest: {
        include: {
          prescribingOrganization: true,
          prescribingOrganizationContact: true
        }
      },
      housingHelpRequest: {
        include: {
          prescribingOrganization: true,
          prescribingOrganizationContact: true
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
