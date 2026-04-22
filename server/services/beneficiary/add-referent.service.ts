import { FamilyFileRepo } from '~/server/database'
import type { SecurityRuleGrantee } from '~/server/security'

export async function addReferentToBeneficiaries({
  user,
  beneficiaries,
  referentId
}: {
  user: SecurityRuleGrantee
  beneficiaries: { beneficiaryId: string; familyFileId: string }[]
  referentId: string
}) {
  const familyFileIds = beneficiaries.map(b => b.familyFileId)

  // Avec connect connect sur une relation many-to-many est idempotent : si le lien existe déjà, Prisma ne lève pas d'erreur et ne crée pas de doublon.
  // C'est géré au niveau de la table de jointure par un INSERT ... ON CONFLICT DO NOTHING (ou équivalent).
  // — Claude
  await Promise.all(
    familyFileIds.map(id =>
      FamilyFileRepo.update(user, {
        where: { id },
        data: { referents: { connect: [{ id: referentId }] } }
      })
    )
  )

  return { count: familyFileIds.length }
}
