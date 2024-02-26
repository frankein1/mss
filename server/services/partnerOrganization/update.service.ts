import { PartnerOrganizationRepo } from '~/server/database'
import { EditPartnerOrganizationInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function update({
  input,
  ctx: _ctx
}: {
  ctx: SecurityRuleContext
  input: EditPartnerOrganizationInput
}) {
  const res = await PartnerOrganizationRepo.prisma.update({
    where: {
      id: input.id
    },
    data: { ...input, inactive: false },
    select: {
      id: true,
      name: true
    }
  })
  return res
}
