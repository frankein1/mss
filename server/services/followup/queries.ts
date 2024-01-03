import { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/database'
import {
  FollowupPermissions,
  SecurityRuleGrantee,
  getFollowupPermissions
} from '~/server/security'

export const querySelect = {
  id: true,
  status: true,
  date: true,
  created: true,
  prescribingOrganization: true,
  updated: true,
  firstFollowup: true,
  redirected: true,
  dueDate: true,
  createdById: true,
  beneficiaryId: true,
  medium: true,
  classified: true,
  forwardedToJustice: true,
  helpRequested: true,
  privateSynthesis: true,
  thirdPersonName: true,
  synthesis: true,
  structureName: true,
  prescribingOrganizationId: true,
  numeroPegase: true,
  place: true,
  ministre: true,
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
  },
  structureId: true
}

export async function getPage(
  user: SecurityRuleGrantee,
  args: Omit<Prisma.FollowupFindManyArgs, 'select' | 'include'>
) {
  const followups = await FollowupRepo.findMany(user, {
    where: args.where,
    select: querySelect,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  return followups.map(followup => {
    const permissions = getFollowupPermissions({
      user,
      beneficiary: followup.beneficiary,
      followup
    })
    filter(permissions, followup)
    return {
      followup,
      permissions
    }
  })
}

export async function getOne(user: SecurityRuleGrantee, id: string) {
  const followup = await FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    select: querySelect
  })
  const permissions = getFollowupPermissions({
    user,
    beneficiary: followup.beneficiary,
    followup
  })
  filter(permissions, followup)
  return {
    followup,
    permissions
  }
}

function filter(
  permissions: FollowupPermissions,
  data: {
    dueDate: Date | null
    privateSynthesis: string | null
  }
) {
  if (!permissions.get.dueDate) {
    data.dueDate = null
  }
  if (!permissions.get.privateSynthesis) {
    data.privateSynthesis = null
  }
}
