import { FamilyFileRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

const BATCH_SIZE = 10

export async function addReferentToFamilyFile({
  user,
  beneficiaries,
  referentId
}: {
  user: SecurityRuleGrantee
  beneficiaries: { beneficiaryId: string; familyFileId: string }[]
  referentId: string
}) {
  const familyFileIds = beneficiaries.map(b => b.familyFileId)

  for (let i = 0; i < familyFileIds.length; i += BATCH_SIZE) {
    const batch = familyFileIds.slice(i, i + BATCH_SIZE)
    await prismaClient.$transaction(
      batch.map(id =>
        FamilyFileRepo.update(user, {
          where: { id },
          data: { referents: { connect: [{ id: referentId }] } }
        })
      )
    )
  }

  return { count: familyFileIds.length }
}
