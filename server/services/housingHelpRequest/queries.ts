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
    where: { id },
    include
  })
}

type HousingHelpRequestOutput = NonNullable<
  Prisma.PromiseReturnType<typeof findOne>
>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const housingHelpRequest = await findOne(ctx.user, id)
  const { socialSupport } = housingHelpRequest
  const { beneficiary } = socialSupport
  const permissions = getHelpRequestPermissions({
    ctx,
    beneficiary,
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
  permissions: HelpRequestPermissions,
  housingHelpRequest: HousingHelpRequestOutput
) {
  const { socialSupport } = housingHelpRequest
  const conditions = {
    details: permissions.get.details,
    minister: appPermissions.module.ministere,
    privateSynthesis: permissions.get.privateSynthesis
  }
  const { types: _, ...filteredSocialSupport } = filterSocialSupport({
    socialSupport,
    conditions
  })
  const filteredHousingHelpRequest = filterHousingHelpRequest({
    housingHelpRequest,
    conditions
  })

  return {
    ...filteredSocialSupport,
    ...filteredHousingHelpRequest,
    id: housingHelpRequest.id,
    socialSupportId: socialSupport.id
  }
}
