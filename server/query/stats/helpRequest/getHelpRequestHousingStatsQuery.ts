import { Prisma } from '@prisma/client'
import { prepareHelpRequestStatFilters } from '../helpers'
import {
  HelpRequestRepo,
  FollowupTypeRepo,
  SocialSupportConstraints,
  SocialSupportRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestHousingStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = { where: prepareHelpRequestStatFilters(input) }
  appendConstraints(user, filters, SocialSupportConstraints.get)

  const [
    housingHelpRequestCount,
    housingHelpRequestContextCount,
    housingHelpRequestReasonCount
  ] = await Promise.all([
    // TODO: requests
  ])

  return {
    housingHelpRequestCount,
    housingHelpRequestContextCount,
    housingHelpRequestReasonCount
  }
}
