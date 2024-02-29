import { SecurityRuleContext } from '~/server/security'
import { SocialSupportRepo } from '~/server/database/repository'
import { SocialSupportConstraints } from '~/server/database/constraints'

export function getOngoing({ ctx: { user } }: { ctx: SecurityRuleContext }) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = SocialSupportConstraints.get(user)

  return SocialSupportRepo.prisma.groupBy({
    by: ['status'],
    where: {
      socialSupportType: 'Followup',
      status: { in: ['Todo', 'InProgress'] },
      createdById: user.id,
      ...constraints
    },
    _count: true
  })
}
