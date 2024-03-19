import { SocialSupportSubjectRepo } from '~/server/database'
import { IdInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function makeInactive({
  input
}: {
  ctx: SecurityRuleContext
  input: IdInput
}) {
  const res = await SocialSupportSubjectRepo.prisma.update({
    where: { id: input.id },
    data: {
      inactive: true
    },
    select: { id: true }
  })

  return res
}
