import { prepareSocialSupportStatFilters } from '../helpers'
import {
  SocialSupportConstraints,
  HelpRequestRepo,
  SocialSupportSubjectRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'
import { prismaDecimalToNumber } from '~/utils/prisma'
import { STATS_NULL_LABEL, STATS_NULL_KEY } from '~/utils/constants/stats'
import { SocialSupportStatus } from '@prisma/client'

export async function getHelpRequestAmountsBySubjectQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // FIXME Use of prisma.groupBy necessitates manual adding of constraints
  const socialSupport = { where: prepareSocialSupportStatFilters(input) }
  appendConstraints(user, socialSupport, SocialSupportConstraints.get)

  // Cannot retrieve organization name from this query so perform in 2 steps
  // https://github.com/prisma/prisma/issues/16243#issue-1445823500
  const [amountsBySubjectId, orgs] = await Promise.all([
    HelpRequestRepo.prisma.groupBy({
      by: ['subjectId'],
      where: {
        financialSupport: true,
        fileInstruction: {
          socialSupport: {
            status: SocialSupportStatus.Accepted,
            ...socialSupport.where
          }
        }
      },
      _sum: {
        allocatedAmount: true
      }
    }),
    SocialSupportSubjectRepo.findMany(user, {
      select: { id: true, name: true }
    })
  ])

  const subjects = orgs.reduce<Record<string, string>>(
    (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
    {}
  )

  return amountsBySubjectId.map(amount => ({
    key: amount.subjectId || STATS_NULL_KEY,
    label: subjects[amount.subjectId || ''] || STATS_NULL_LABEL,
    count: prismaDecimalToNumber(amount._sum.allocatedAmount) || 0
  }))
}
