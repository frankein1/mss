import type { SecurityRuleContext } from '~/server/security'
import { getFamilyFilePermissions } from '~/server/security'
import { FamilyFileRepo } from '~/server/database'

export async function getMinimalInfo({
  ctx,
  input: { id }
}: {
  ctx: SecurityRuleContext
  input: { id: string }
}) {
  const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
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
      },
      referents: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  })

  // TODO: move permissions to a property of the familyFile model ?
  const permissions = getFamilyFilePermissions({
    ctx,
    familyFile
  })

  return { ...familyFile, permissions }
}
