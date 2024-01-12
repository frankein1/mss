import { prepareSocialSupportStatFilters } from '../helpers'
import { FollowupRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupActionsEntreprisesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedSocialSupportFilters = prepareSocialSupportStatFilters(input)

  const followups = await FollowupRepo.findMany(user, {
    where: {
      OR: [{ redirected: true }, { helpRequested: true }],
      socialSupport: preparedSocialSupportFilters
    },
    select: {
      redirected: true,
      helpRequested: true
    }
  })

  const followupsActionsEntreprises = {
    redirected: {
      actionEntrepriseId: 'redirected',
      actionEntreprise: 'Réorientation',
      _count: 0
    },
    helpRequested: {
      actionEntrepriseId: 'helpRequested',
      actionEntreprise: 'Instruction',
      _count: 0
    }
  }

  followups.forEach(followup => {
    if (followup.redirected) {
      followupsActionsEntreprises.redirected._count++
    }
    if (followup.helpRequested) {
      followupsActionsEntreprises.helpRequested._count++
    }
  })

  const followupsActionsEntreprisesValues = Object.values(
    followupsActionsEntreprises
  )

  followupsActionsEntreprisesValues.sort((a, b) => b._count - a._count)

  return followupsActionsEntreprisesValues
}
