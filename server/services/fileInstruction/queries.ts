import { Prisma } from '@prisma/client'
import {
  filterFileInstruction,
  filterHelpRequest,
  filterSocialSupport
} from '../helper'
import {
  AppContextPermissions,
  FileInstructionPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getFileInstructionPermissions
} from '~/server/security'
import { FileInstructionRepo } from '~/server/database/repository/FileInstructionRepository'

export const include = {
  instructorOrganization: true,
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
  },
  helpRequest: {
    include: {
      prescribingOrganization: true
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return FileInstructionRepo.findUniqueOrThrow(user, {
    where: { id },
    include
  })
}

type FileInstructionOutput = NonNullable<
  Prisma.PromiseReturnType<typeof findOne>
>

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.FileInstructionFindManyArgs, 'select' | 'include'>
) {
  const fileInstructions = await FileInstructionRepo.findMany(ctx.user, {
    where: args.where,
    include,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  return fileInstructions.map(fileInstruction => {
    const { socialSupport } = fileInstruction
    const { beneficiary } = socialSupport
    const permissions = getFileInstructionPermissions({
      ctx,
      beneficiary,
      socialSupport
    })
    const appPermissions = getAppContextPermissions(ctx)
    return {
      fileInstruction: filter(appPermissions, permissions, fileInstruction),
      permissions
    }
  })
}

export function filter(
  appPermissions: AppContextPermissions,
  permissions: FileInstructionPermissions,
  fileInstruction: FileInstructionOutput
) {
  const { socialSupport, helpRequest } = fileInstruction

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

  const filteredFileInstruction = filterFileInstruction({
    fileInstruction,
    conditions
  })

  return {
    ...filteredFileInstruction,
    socialSupport: filteredSocialSupport,
    helpRequest: filteredHelpRequest || null
  }
}
