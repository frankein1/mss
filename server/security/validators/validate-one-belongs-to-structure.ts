import type { SecurityRuleGrantee } from '~/server/security'

type StructureScopedFinder = (
  user: SecurityRuleGrantee,
  args: { select: { id: true }; where: { id: string } }
) => Promise<unknown>

export async function validateOneBelongsToStructure(
  user: SecurityRuleGrantee,
  id: string,
  finder: StructureScopedFinder
): Promise<boolean> {
  try {
    const result = await finder(user, {
      select: { id: true },
      where: { id }
    })
    return !!result
  } catch {
    return false
  }
}
