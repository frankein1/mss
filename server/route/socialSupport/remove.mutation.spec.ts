import { prismaClient } from '~/server/prisma'
import { afterEach, expect, describe } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'

const structureId = fixtureStructures[FixtureStructure.Test].id
const createdById = fixturesUsers[FixtureUserRole.SocialWorker].id

let socialSupportIds: string[] = []
let redirectionReasonIds: string[] = []

async function createSocialSupportWithRedirection(reasonName: string) {
  const familyFile = await prismaClient.familyFile.create({
    select: { id: true },
    data: { structure: { connect: { id: structureId } } }
  })

  const beneficiary = await prismaClient.beneficiary.create({
    select: { id: true },
    data: {
      structure: { connect: { id: structureId } },
      familyFile: { connect: { id: familyFile.id } },
      createdBy: { connect: { id: createdById } },
      fileNumber: `TEST-${Date.now()}-${Math.random()}`,
      status: 'Active'
    }
  })

  const reason = await prismaClient.redirectionReason.upsert({
    where: { structureId_name: { structureId, name: reasonName } },
    create: { name: reasonName, structureId, createdById },
    update: {},
    select: { id: true }
  })
  redirectionReasonIds.push(reason.id)

  const socialSupport = await prismaClient.socialSupport.create({
    select: { id: true },
    data: {
      structure: { connect: { id: structureId } },
      familyFile: { connect: { id: familyFile.id } },
      beneficiary: { connect: { id: beneficiary.id } },
      createdBy: { connect: { id: createdById } },
      socialSupportType: 'Followup',
      status: 'InProgress',
      date: new Date(),
      followup: { create: { medium: 'PlannedInPerson' } },
      socialSupportRedirections: {
        create: {
          type: 'Other',
          redirectionReason: { connect: { id: reason.id } }
        }
      }
    }
  })
  socialSupportIds.push(socialSupport.id)

  return {
    socialSupportId: socialSupport.id,
    reasonId: reason.id,
    familyFile,
    beneficiary
  }
}

afterEach(async () => {
  if (socialSupportIds.length > 0) {
    await prismaClient.socialSupport.deleteMany({
      where: { id: { in: socialSupportIds } }
    })
    socialSupportIds = []
  }
  if (redirectionReasonIds.length > 0) {
    await prismaClient.redirectionReason.deleteMany({
      where: { id: { in: redirectionReasonIds } }
    })
    redirectionReasonIds = []
  }
})

describe('SocialSupport - Remove - Autorisations', () => {
  test('Un utilisateur d’une autre structure ne peut pas supprimer un social support', async ({
    trpc
  }) => {
    const { socialSupportId } = await createSocialSupportWithRedirection(
      'Motif test isolation'
    )

    await expect(() =>
      trpc.structureManagerMinistere.socialSupport.remove({
        id: socialSupportId
      })
    ).rejects.toThrowError(/socialSupport[\s\S]*?no record/im)
  })

  test('Un administrateur ne peut pas supprimer un social support', async ({
    trpc
  }) => {
    const { socialSupportId } =
      await createSocialSupportWithRedirection('Motif test admin')

    await expect(() =>
      trpc.administrator.socialSupport.remove({ id: socialSupportId })
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })
})

describe('SocialSupport - Remove - Suppression du RedirectionReason orphelin', () => {
  test('Supprimer un SocialSupport supprime ses SocialSupportRedirections et le RedirectionReason associé s’il n’est plus utilisé', async ({
    trpc
  }) => {
    const { socialSupportId, reasonId } =
      await createSocialSupportWithRedirection('Accès aux droits test')

    await trpc.socialWorker.socialSupport.remove({ id: socialSupportId })
    socialSupportIds = socialSupportIds.filter(id => id !== socialSupportId)

    const reason = await prismaClient.redirectionReason.findUnique({
      where: { id: reasonId }
    })
    expect(reason).toBeNull()
  })

  test('Supprimer un SocialSupport ne supprime pas le RedirectionReason s’il est encore utilisé par une autre SocialSupportRedirection', async ({
    trpc
  }) => {
    const reasonName = 'Motif partagé entre deux accompagnements'

    const { socialSupportId: id1, reasonId } =
      await createSocialSupportWithRedirection(reasonName)

    // Second social support partage le même motif
    await createSocialSupportWithRedirection(reasonName)
    // redirectionReasonIds contient le même id deux fois — dédupliquer n'est pas nécessaire
    // car deleteMany with { id: { in: [...] } } est idempotent

    await trpc.socialWorker.socialSupport.remove({ id: id1 })
    socialSupportIds = socialSupportIds.filter(id => id !== id1)

    const reason = await prismaClient.redirectionReason.findUnique({
      where: { id: reasonId }
    })
    expect(reason).not.toBeNull()
  })

  test('Supprimer un SocialSupport sans redirection ne provoque pas d’erreur', async ({
    trpc
  }) => {
    const familyFile = await prismaClient.familyFile.create({
      select: { id: true },
      data: { structure: { connect: { id: structureId } } }
    })
    const beneficiary = await prismaClient.beneficiary.create({
      select: { id: true },
      data: {
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        createdBy: { connect: { id: createdById } },
        fileNumber: `TEST-${Date.now()}-${Math.random()}`,
        status: 'Active'
      }
    })
    const socialSupport = await prismaClient.socialSupport.create({
      select: { id: true },
      data: {
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        beneficiary: { connect: { id: beneficiary.id } },
        createdBy: { connect: { id: createdById } },
        socialSupportType: 'Followup',
        status: 'InProgress',
        date: new Date(),
        followup: { create: { medium: 'PlannedInPerson' } }
      }
    })
    socialSupportIds.push(socialSupport.id)

    await expect(
      trpc.socialWorker.socialSupport.remove({ id: socialSupport.id })
    ).resolves.not.toThrow()

    socialSupportIds = socialSupportIds.filter(id => id !== socialSupport.id)
  })
})
