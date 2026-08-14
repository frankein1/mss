import { UserRepo } from '~~/server/database'
import type { SecurityRuleGrantee } from '~~/server/security'

export async function deleteReferentFromFamilyfile({
  user,
  familyFileIds,
  referentId
}: {
  user: SecurityRuleGrantee
  familyFileIds: string[]
  referentId: string
}) {
  const updatedReferent = await UserRepo.update(user, {
    where: { id: referentId },
    data: {
      referentFor: {
        disconnect: familyFileIds.map(id => ({
          id
        }))
      }
    }
  })

  return { id: updatedReferent.id }
}
