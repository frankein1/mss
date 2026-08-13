import type { SecurityRuleGrantee } from '~~/server/security'

type StructureScopedCounter = (
  user: SecurityRuleGrantee,
  args: { where: { id: { in: string[] } } }
) => Promise<number>

function deduplicate(ids: string[]): string[] {
  return [...new Set(ids)]
}

export async function validateManyBelongToStructure(
  user: SecurityRuleGrantee,
  ids: string[],
  counter: StructureScopedCounter
): Promise<boolean> {
  const uniqueIds = deduplicate(ids)
  if (uniqueIds.length === 0) {
    return true
  }

  const count = await counter(user, { where: { id: { in: uniqueIds } } })
  return count === uniqueIds.length
}
