import { Prisma } from '@prisma/client'
import { filterHousingHelpRequest, filterSocialSupport } from '../helper'
import { HousingHelpRequestRepo } from '~/server/database'
import {
  AppContextPermissions,
  HelpRequestPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getHelpRequestPermissions
} from '~/server/security'

export const include = {
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
  return HousingHelpRequestRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    include
  })
}

type HousingHelpRequestOutput = Prisma.PromiseReturnType<typeof findOne>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const helpRequest = await HousingHelpRequestRepo.findUniqueOrThrow(ctx.user, {
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
  helpRequest: NonNullable<HousingHelpRequestOutput>
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
  const filteredHelpRequest = filterHousingHelpRequest({
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
