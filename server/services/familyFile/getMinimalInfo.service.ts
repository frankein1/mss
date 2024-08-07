import { SecurityRuleContext } from '~/server/security'
import { FamilyFileRepo } from '~/server/database'

export async function getMinimalInfo({
  ctx: { user },
  input: { id }
}: {
  ctx: SecurityRuleContext
  input: { id: string }
}) {
  return await FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      beneficiaries: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          birthDate: true,
          relationship: true
        },
        orderBy: { created: 'asc' }
      }
    }
  })
}
