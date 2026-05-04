import { FamilyFileRepo, UserRepo } from '~/server/database'
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
  const updatedReferent = await UserRepo.update(user, {
    where: {
      id: referentId
    },
    data: {
      referentFor: {
        connect: beneficiaries.map(b => ({
          id: b.familyFileId
        }))
      }
    },
    select: {
      id: true
    }
  })

  return { id: updatedReferent.id }
}
