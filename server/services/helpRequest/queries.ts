import { Prisma } from '@prisma/client'
import { filterHelpRequest, filterSocialSupport } from '../helper'
import { HelpRequestRepo } from '~/server/database'
import {
  AppContextPermissions,
  HelpRequestPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getHelpRequestPermissions
} from '~/server/security'

export const include = {
  prescribingOrganization: true,
  instructorOrganization: true,
  socialSupport: {
    include: {
      types: true,
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

function findOne(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    include
  })
}

type HelpRequestOutput = Prisma.PromiseReturnType<typeof findOne>

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.HelpRequestFindManyArgs, 'select' | 'include'>
) {
  const helpRequests = await HelpRequestRepo.findMany(ctx.user, {
    where: args.where,
    include,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  return helpRequests.map(helpRequest => {
    const { socialSupport } = helpRequest
    const { beneficiary } = socialSupport
    const permissions = getHelpRequestPermissions({
      ctx,
      beneficiary,
      socialSupport
    })
    const appPermissions = getAppContextPermissions(ctx)
    return {
      helpRequest: filter(appPermissions, permissions, helpRequest),
      permissions
    }
  })
}

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const helpRequest = await HelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    include
  })
  const { socialSupport } = helpRequest
  const { beneficiary } = socialSupport
  const permissions = getHelpRequestPermissions({
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
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestOutput>
) {
  const { socialSupport } = helpRequest
  const conditions = {
    details: permissions.get.details,
    dueDate: permissions.get.dueDate,
    minister: appPermissions.module.ministere,
    privateSynthesis: permissions.get.privateSynthesis
  }
  const filteredSocialSupport = filterSocialSupport({
    socialSupport,
    conditions
  })
  const filteredHelpRequest = filterHelpRequest({
    helpRequest,
    conditions
  })

  const type = filteredSocialSupport.types?.length
    ? filteredSocialSupport.types[0]
    : null

  return {
    ...filteredSocialSupport,
    ...filteredHelpRequest,
    type,
    typeId: type?.id,
    id: helpRequest.id,
    socialSupportId: socialSupport.id
  }
}
