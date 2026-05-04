import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

export async function addReferentToFamilyFile({
  beneficiaries,
  referentId
}: {
  user: SecurityRuleGrantee
  beneficiaries: { beneficiaryId: string; familyFileId: string }[]
  referentId: string
}) {
  const familyFileIds = beneficiaries.map(b => b.familyFileId)

  await prismaClient.user.update({
    where: { id: referentId },
    data: { referentFor: { connect: familyFileIds.map(id => ({ id })) } }
  })
}
