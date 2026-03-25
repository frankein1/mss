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

export const include = {
  prescribingOrganization: true,
  prescribingOrganizationContact: true,
  fileInstruction: {
    include: {
      instructorOrganization: true,
      instructorOrganizationContact: true,
      socialSupport: {
        include: {
          subjects: true,
          lastUpdatedBy: true,
          documents: true,
          minister: true,
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
          },
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
              birthPlace: true,
              birthDate: true
            }
          },
          createdBy: true
        }
      }
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return HousingHelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    include
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
