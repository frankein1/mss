import { Prisma } from '@prisma/client'
import { filterFollowup, filterSocialSupport } from '../helper'
import { FollowupRepo } from '~/server/database'
import {
  AppContextPermissions,
  FollowupPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getFollowupPermissions
} from '~/server/security'

const include = {
  prescribingOrganization: true,
  prescribingOrganizationContact: true,
  socialSupport: {
    include: {
      documents: true,
      subjects: true,
      familyFile: {
        include: {
          referents: true,
          beneficiaries: true
        }
      },
      createdBy: true
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    include
  })
}

type FollowupOutput = NonNullable<Prisma.PromiseReturnType<typeof findOne>>

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.FollowupFindManyArgs, 'select' | 'include'>
) {
  const followups = await FollowupRepo.findMany(ctx.user, {
    where: args.where,
    include,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  return followups.map(followup => {
    const permissions = getFollowupPermissions({
      ctx,
      familyFile: followup.socialSupport.familyFile,
      socialSupport: followup.socialSupport
    })
    const appPermissions = getAppContextPermissions(ctx)
    return {
      followup: filter(appPermissions, permissions, followup),
      permissions
    }
  })
}

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const followup = await findOne(ctx.user, id)
  const { socialSupport } = followup
  const permissions = getFollowupPermissions({
    ctx,
    familyFile: socialSupport.familyFile,
    socialSupport
  })
  const appPermissions = getAppContextPermissions(ctx)
  return {
    followup: filter(appPermissions, permissions, followup),
    permissions
  }
}

export function filter(
  appPermissions: AppContextPermissions,
  permissions: FollowupPermissions,
  followup: FollowupOutput
) {
  const { socialSupport } = followup
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
  const filteredFollowup = filterFollowup({
    followup,
    conditions
  })

  return {
    ...filteredSocialSupport,
    ...filteredFollowup,
    id: followup.id,
    socialSupportId: socialSupport.id
  }
}
