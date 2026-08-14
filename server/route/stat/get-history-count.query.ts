import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { statFilterSchema } from '~~/server/schema'
import { prepareSocialSupportStatFilters } from '~~/server/query/stats/helpers'
import {
  getFollowupBeneficiaryNumberQuery,
  getFollowupCountQuery,
  getHelpRequestBeneficiaryNumberQuery,
  getHelpRequestCountQuery
} from '~~/server/query/stats'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { FollowupRepo } from '~~/server/database'

const securityCheck = AllowSecurityCheck

/* This could be splitted into two routes to avoid overfetching */
const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const [
    helpRequests,
    followups,
    firstFollowups,
    followupBeneficiaries,
    helpRequestBeneficiaries
  ] = await Promise.all([
    getHelpRequestCountQuery(user, input),
    getFollowupCountQuery(user, input),
    FollowupRepo.count(user, {
      where: {
        firstFollowup: true,
        socialSupport: prepareSocialSupportStatFilters(input)
      }
    }),
    getFollowupBeneficiaryNumberQuery(user, input),
    getHelpRequestBeneficiaryNumberQuery(user, input)
  ])

  return {
    helpRequests,
    followups,
    firstFollowups,
    followupBeneficiaries,
    helpRequestBeneficiaries
  }
}

export const getHistoryCountsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
