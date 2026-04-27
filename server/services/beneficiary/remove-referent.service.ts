import { FamilyFileRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

export async function removeReferentFromBeneficiaries({
  user,
  beneficiaries,
  referentId
}: {
  user: SecurityRuleGrantee
  beneficiaries: { beneficiaryId: string; familyFileId: string }[]
  referentId: string
}) {
  const familyFileIds = beneficiaries.map(b => b.familyFileId)

  await prismaClient.$transaction(
    familyFileIds.map(id =>
      FamilyFileRepo.update(user, {
        where: { id },
        data: { referents: { disconnect: [{ id: referentId }] } }
      })
    )
  )

  return { count: familyFileIds.length }
}
