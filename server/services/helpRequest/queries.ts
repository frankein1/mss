import { Prisma } from '@prisma/client'
import {
  filterFileInstruction,
  filterHelpRequest,
  filterSocialSupport
} from '../helper'
import { HelpRequestRepo } from '~/server/database'
import {
  AppContextPermissions,
  FileInstructionPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
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
          documents: true,
          beneficiary: {
            include: {
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
  return HelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    include
  })
}

type HelpRequestOutput = NonNullable<Prisma.PromiseReturnType<typeof findOne>>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const helpRequest = await findOne(ctx.user, id)
  const {
    fileInstruction: { socialSupport }
  } = helpRequest
  const { beneficiary } = socialSupport
  const permissions = getFileInstructionPermissions({
    ctx,
    beneficiary,
    socialSupport
  })
  const appPermissions = getAppContextPermissions(ctx)
  return {
    helpRequest: filter(appPermissions, permissions, helpRequest),
    permissions
  }
}

export function filter(
  appPermissions: AppContextPermissions,
  permissions: FileInstructionPermissions,
  helpRequest: HelpRequestOutput
) {
  const { fileInstruction } = helpRequest
  const { socialSupport } = fileInstruction

  const conditions = {
    details: permissions.get.details,
    minister: appPermissions.module.ministere,
    privateSynthesis: permissions.get.privateSynthesis
  }
  const { subjects, ...filteredSocialSupport } = filterSocialSupport({
    socialSupport,
    conditions
  })
  const socialSupportSubject = subjects.length ? subjects[0] : null
  const filteredHelpRequest = filterHelpRequest({
    helpRequest,
    conditions
  })

  const filteredFileInstruction = filterFileInstruction({
    fileInstruction,
    conditions
  })

  return {
    ...filteredHelpRequest,
    subject: socialSupportSubject,
    subjectId: socialSupportSubject?.id,
    fileInstruction: {
      ...filteredFileInstruction,
      socialSupport: filteredSocialSupport
    }
  }
}
