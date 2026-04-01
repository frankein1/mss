import type { Prisma } from '@prisma/client'
import { filterFollowup, filterSocialSupport } from '../helper'
import { FollowupRepo } from '~/server/database'
import type {
  AppContextPermissions,
  FollowupPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import {
  getAppContextPermissions,
  getFollowupPermissions
} from '~/server/security'

const select = {
  id: true,
  updated: true,
  socialSupportId: true,
  structureName: true,
  redirected: true,
  medium: true,
  classified: true,
  forwardedToJustice: true,
  firstFollowup: true,
  helpRequested: true,
  thirdPersonName: true,
  place: true,
  duration: true,
  prescribingOrganizationId: true,
  prescribingOrganization: {
    select: { id: true, name: true }
  },
  prescribingOrganizationContactId: true,
  prescribingOrganizationContact: {
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
          fileNumber: true,
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

function findOne(user: SecurityRuleGrantee, id: string) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    select
  })
}

type FollowupOutput = NonNullable<Prisma.PromiseReturnType<typeof findOne>>

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.FollowupFindManyArgs, 'select'>
) {
  const followups = await FollowupRepo.findMany(ctx.user, {
    where: args.where,
    select,
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
    ministerId: appPermissions.module.ministere,
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

  // Attached document names are visible for all roles that can access the followup
  const documentNames = socialSupport.documents.map(d => ({
    key: d.key,
    name: d.name
  }))

  return {
    ...filteredSocialSupport,
    ...filteredFollowup,
    documents: documentNames,
    id: followup.id,
    socialSupportId: socialSupport.id
  }
}
