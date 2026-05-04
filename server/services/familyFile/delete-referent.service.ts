import { UserRepo } from '~/server/database'
import type { SecurityRuleGrantee } from '~/server/security'

export async function deleteReferentFromFamilyfile({
  user,
  beneficiaries,
  referentId
}: {
  user: SecurityRuleGrantee
  beneficiaries: { beneficiaryId: string; familyFileId: string }[]
  referentId: string
}) {
  const updatedReferent = await UserRepo.update(user, {
    where: { id: referentId },
    data: {
      referentFor: {
        disconnect: beneficiaries.map(b => ({ id: b.familyFileId }))
      }
    }
  })

  return { id: updatedReferent.id }
}
