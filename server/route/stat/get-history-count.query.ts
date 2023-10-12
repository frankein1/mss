import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'
import {
  getFollowupCountQuery,
  getHelpRequestCountQuery
} from '~/server/query/stats'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FollowupRepo } from '~/server/query'

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const helpRequests = await getHelpRequestCountQuery(user, input)
  const followups = await getFollowupCountQuery(user, input)

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const firstFollowups = await FollowupRepo.count(user, {
    where: {
      structureId: structure.id,
      firstFollowup: true,
      ...prepareFollowupStatFilters(input),
      beneficiary: {
        referents
      }
    }
  })

  return { helpRequests, followups, firstFollowups }
}

export const getHistoryCountsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
