import { prismaClient } from '~/server/prisma'
import { describe, it, expect, afterEach } from 'vitest'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import {
  resolveRedirectionReasonIds,
  deleteOrphanedRedirectionReasons
} from './helper'
import { createSecurityContext } from '~/test/server/test-utils'

const structureId = fixtureStructures[FixtureStructure.Test].id
const createdById = fixturesUsers[FixtureUserRole.SocialWorker].id

const ctx = createSecurityContext({
  id: createdById,
  role: fixturesUsers[FixtureUserRole.SocialWorker].role,
  status: fixturesUsers[FixtureUserRole.SocialWorker].status,
  structure: {
    id: structureId,
    type: fixtureStructures[FixtureStructure.Test].type,
    externalRdvspActive: null
  }
})

let reasonIds: string[] = []
let socialSupportIds: string[] = []

async function createSocialSupportWithReason(reasonId: string) {
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
      followup: { create: { medium: 'PlannedInPerson' } },
      socialSupportRedirections: {
        create: {
          type: 'Other',
          redirectionReason: { connect: { id: reasonId } }
        }
      }
    }
  })
  socialSupportIds.push(socialSupport.id)
  return socialSupport
}

afterEach(async () => {
  if (socialSupportIds.length > 0) {
    await prismaClient.socialSupport.deleteMany({
      where: { id: { in: socialSupportIds } }
    })
    socialSupportIds = []
  }
  if (reasonIds.length > 0) {
    await prismaClient.redirectionReason.deleteMany({
      where: { id: { in: reasonIds } }
    })
    reasonIds = []
  }
})

describe('resolveRedirectionReasonIds', () => {
  it("crée le motif s'il n'existe pas et retourne son id", async () => {
    const name = `Nouveau motif ${Date.now()}`

    const result = await resolveRedirectionReasonIds(ctx, [
      { redirectionReasonName: name }
    ])

    expect(result.has(name)).toBe(true)
    const id = result.get(name)!
    reasonIds.push(id)

    const reason = await prismaClient.redirectionReason.findUnique({
      where: { id }
    })
    expect(reason).not.toBeNull()
    expect(reason?.name).toBe(name)
    expect(reason?.structureId).toBe(structureId)
  })

  it("retourne l'id existant sans créer de doublon si le motif existe déjà", async () => {
    const name = `Motif existant ${Date.now()}`
    const existing = await prismaClient.redirectionReason.create({
      select: { id: true },
      data: { name, structureId, createdById }
    })
    reasonIds.push(existing.id)

    const result = await resolveRedirectionReasonIds(ctx, [
      { redirectionReasonName: name }
    ])

    expect(result.get(name)).toBe(existing.id)
    const count = await prismaClient.redirectionReason.count({
      where: { structureId, name }
    })
    expect(count).toBe(1)
  })

  it("retourne une Map vide si aucune redirection n'a de redirectionReasonName", async () => {
    const result = await resolveRedirectionReasonIds(ctx, [
      { redirectionReasonName: null },
      { redirectionReasonName: undefined },
      {}
    ])

    expect(result.size).toBe(0)
  })

  it('retourne une Map vide si la liste de redirections est null ou undefined', async () => {
    expect((await resolveRedirectionReasonIds(ctx, null)).size).toBe(0)
    expect((await resolveRedirectionReasonIds(ctx, undefined)).size).toBe(0)
  })

  it("déduplique les noms identiques et ne crée qu'un seul motif", async () => {
    const name = `Motif dédupliqué ${Date.now()}`

    const result = await resolveRedirectionReasonIds(ctx, [
      { redirectionReasonName: name },
      { redirectionReasonName: name }
    ])

    expect(result.size).toBe(1)
    const id = result.get(name)!
    reasonIds.push(id)

    const count = await prismaClient.redirectionReason.count({
      where: { structureId, name }
    })
    expect(count).toBe(1)
  })
})

describe('deleteOrphanedRedirectionReasons', () => {
  it("supprime le motif s'il n'est plus référencé par aucune SocialSupportRedirection", async () => {
    const reason = await prismaClient.redirectionReason.create({
      select: { id: true },
      data: { name: `Motif orphelin ${Date.now()}`, structureId, createdById }
    })
    reasonIds.push(reason.id)

    await deleteOrphanedRedirectionReasons([reason.id])

    const found = await prismaClient.redirectionReason.findUnique({
      where: { id: reason.id }
    })
    expect(found).toBeNull()
    reasonIds = reasonIds.filter(id => id !== reason.id)
  })

  it("ne supprime pas le motif s'il est encore utilisé par une SocialSupportRedirection", async () => {
    const reason = await prismaClient.redirectionReason.create({
      select: { id: true },
      data: { name: `Motif utilisé ${Date.now()}`, structureId, createdById }
    })
    reasonIds.push(reason.id)

    await createSocialSupportWithReason(reason.id)

    await deleteOrphanedRedirectionReasons([reason.id])

    const found = await prismaClient.redirectionReason.findUnique({
      where: { id: reason.id }
    })
    expect(found).not.toBeNull()
  })

  it("ne fait rien si la liste d'ids est vide", async () => {
    await expect(deleteOrphanedRedirectionReasons([])).resolves.not.toThrow()
  })

  it('ignore les ids null et undefined sans erreur', async () => {
    await expect(
      deleteOrphanedRedirectionReasons([null, undefined])
    ).resolves.not.toThrow()
  })
})
