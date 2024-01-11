import { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/database'
import {
  FollowupPermissions,
  SecurityRuleGrantee,
  getFollowupPermissions
} from '~/server/security'

const select = {
  id: true,
  prescribingOrganization: true,
  updated: true,
  firstFollowup: true,
  redirected: true,
  medium: true,
  classified: true,
  forwardedToJustice: true,
  helpRequested: true,
  thirdPersonName: true,
  structureName: true,
  prescribingOrganizationId: true,
  place: true,
  socialSupport: {
    select: {
      id: true,
      structureId: true,
      status: true,
      date: true,
      created: true,
      createdById: true,
      beneficiaryId: true,
      privateSynthesis: true,
      numeroPegase: true,
      synthesis: true,
      ministre: true,
      dueDate: true,
      documents: {
        select: {
          key: true,
          name: true,
          type: true,
          size: true,
          tags: true,
          confidential: true
        }
      },
      types: {
        select: { id: true, name: true },
        orderBy: { name: Prisma.SortOrder.asc }
      },
      beneficiary: {
        select: {
          id: true,
          fileNumber: true,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          referents: true,
          structureId: true
        }
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    select
  })
}

type FollowupOutput = Prisma.PromiseReturnType<typeof findOne>

export async function getPage(
  user: SecurityRuleGrantee,
  args: Omit<Prisma.FollowupFindManyArgs, 'select' | 'include'>
) {
  const followups = await FollowupRepo.findMany(user, {
    where: args.where,
    select,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  return followups.map(followup => {
    const permissions = getFollowupPermissions({
      user,
      beneficiary: followup.socialSupport.beneficiary,
      socialSupport: followup.socialSupport
    })
    return {
      followup: filter(permissions, followup),
      permissions
    }
  })
}

export async function getOne(user: SecurityRuleGrantee, id: string) {
  const followup = await FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    select
  })
  const { socialSupport } = followup
  const permissions = getFollowupPermissions({
    user,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
  return {
    followup: filter(permissions, followup),
    permissions
  }
}

function filter(permissions: FollowupPermissions, followup: FollowupOutput) {
  const { socialSupport, ...fuData } = followup
  const { privateSynthesis, dueDate, ...socialSupportData } = socialSupport
  return {
    ...fuData,
    ...socialSupportData,
    dueDate: permissions.get.dueDate ? dueDate : null,
    privateSynthesis: permissions.get.privateSynthesis ? privateSynthesis : null
  }
}
