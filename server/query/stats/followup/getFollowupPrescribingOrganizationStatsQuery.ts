import {
  prepareSocialSupportStatFilters,
  preparePrescribingOrganizationStats
} from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupPrescribingOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareSocialSupportStatFilters(input)

  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: {
      socialSupportType: 'Followup',
      ...preparedFilters
    },
    select: {
      followup: {
        select: {
          prescribingOrganization: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  const followups = socialSupports.reduce(
    (fu, { followup }) => (followup !== null ? [...fu, followup] : fu),
    [] as Array<Exclude<(typeof socialSupports)[0]['followup'], null>>
  )

  return preparePrescribingOrganizationStats(followups)
}
