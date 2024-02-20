import { PartnerOrganizationRepo } from '~/server/database'
import { IdInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function remove({
  input,
  ctx: _ctx
}: {
  ctx: SecurityRuleContext
  input: IdInput
}) {
  await PartnerOrganizationRepo.prisma.update({
    where: {
      id: input.id
    },
    data: {
      inactive: true
    }
  })
}
