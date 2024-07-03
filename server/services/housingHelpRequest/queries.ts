import { Prisma } from '@prisma/client'
import {
  filterFileInstruction,
  filterHousingHelpRequest,
  filterSocialSupport
} from '../helper'
import { HousingHelpRequestRepo } from '~/server/database'
import {
  AppContextPermissions,
  FileInstructionPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getFileInstructionPermissions
} from '~/server/security'

export const include = {
  fileInstruction: {
    include: {
      instructorOrganization: true,
      instructorOrganizationContact: true,
      socialSupport: {
        include: {
          subjects: true,
          documents: true,
          familyFile: {
            include: {
              beneficiaries: true,
              referents: true
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

  return {
    ...filteredHousingHelpRequest,
    fileInstruction: {
      ...filteredFileInstruction,
      socialSupport: filteredSocialSupport
    }
  }
}
