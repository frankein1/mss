import { PartnerOrganizationRepo } from '~/server/database'
import { IdInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function makeActive({
  input,
  ctx: _ctx
}: {
  ctx: SecurityRuleContext
  input: IdInput
}) {
  const res = await PartnerOrganizationRepo.prisma.update({
    where: {
      id: input.id
    },
    data: { inactive: false },
    select: {
      id: true,
      name: true
    }
  })
  return res
}
