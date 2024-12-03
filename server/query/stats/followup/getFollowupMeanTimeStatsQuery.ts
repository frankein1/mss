import { prepareFollowupStatFilters } from '../helpers'
import { SocialSupportSubjectRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupMeanTimeStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const res = await SocialSupportSubjectRepo.findMany(user, {
    where: {
      socialSupports: {
        some: {
          followup: {
            duration: { not: null }
          }
        }
      }
    },
    select: {
      id: true,
      name: true,
      socialSupports: {
        where: {
          ...prepareFollowupStatFilters(input),
          followup: {
            duration: { not: null }
          }
        },
        select: {
          followup: {
            select: {
              duration: true
            }
          }
        }
      }
    }
  })

  return res
}
