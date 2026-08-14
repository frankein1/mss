import { UserRepo } from '~~/server/database'

import type { SecurityRuleGrantee } from '~~/server/security'

export async function addReferentToFamilyFile({
  user,
  familyFileIds,
  referentId
}: {
  user: SecurityRuleGrantee
  familyFileIds: string[]
  referentId: string
}) {
  const updatedReferent = await UserRepo.update(user, {
    where: {
      id: referentId
    },
    data: {
      referentFor: {
        connect: familyFileIds.map(id => ({
          id
        }))
      }
    },
    select: {
      id: true
    }
  })

  return { id: updatedReferent.id }
}
