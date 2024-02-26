import { PartnerOrganizationRepo } from '~/server/database'
import { AddPartnerOrganizationInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function create({
  input,
  ctx
}: {
  ctx: SecurityRuleContext
  input: AddPartnerOrganizationInput
}) {
  const res = await PartnerOrganizationRepo.prisma.create({
    data: { ...input, createdById: ctx.user.id, structureId: ctx.structure.id },
    select: {
      id: true,
      name: true
    }
  })
  return res
}
