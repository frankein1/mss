import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'

let familyFileId: string
let beneficiaryId: string

const structureId = fixtureStructures[FixtureStructure.Test].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

const SUPPORT_PROGRAM_NAMES_USED = [
  'UDT-Portage de repas',
  'UDT-Ancien dispositif',
  'UDT-Nouveau dispositif',
  'UDT-Nouveau nom',
  'UDT-Dispositif référent',
  'UDT-Dispositif complet'
]

beforeEach(async () => {
  const familyFile = await prismaClient.familyFile.create({
    data: {
      structure: { connect: { id: structureId } },
      referents: { connect: [{ id: referentId }] }
    }
  })
  familyFileId = familyFile.id

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFileId } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: socialWorkerId } },
      fileNumber: 'TEST-SUPPORT-PROGRAM-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { structureId, name: { in: SUPPORT_PROGRAM_NAMES_USED } }
  })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
})

describe('Authorizations', () => {
  test('Un ReceptionAgent ne peut pas modifier les dispositifs', async ({
    trpc
  }) => {
    await expect(
      trpc.receptionAgent.beneficiary.updateSupportPrograms({
        id: beneficiaryId,
        supportPrograms: []
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('Un utilisateur dune autre structure ne peut pas modifier les dispositifs', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.beneficiary.updateSupportPrograms({
        id: beneficiaryId,
        supportPrograms: []
      })
    ).rejects.toThrowError(/no record/i)
  })
})

describe('Comportement', () => {
  test('Un StructureManager peut ajouter des dispositifs', async ({ trpc }) => {
    const supportProgramId = v4()
    const result =
      await trpc.structureManager.beneficiary.updateSupportPrograms({
        id: beneficiaryId,
        supportPrograms: [
          { id: supportProgramId, name: 'UDT-Portage de repas' }
        ]
      })

    expect(result.id).toBe(beneficiaryId)

    const supportPrograms = await prismaClient.supportProgram.findMany({
      where: { beneficiaryId },
      include: { supportProgramName: true }
    })
    expect(supportPrograms).toHaveLength(1)
    expect(supportPrograms[0]!.supportProgramName.name).toBe(
      'UDT-Portage de repas'
    )
  })

  test('La mise à jour remplace tous les dispositifs existants', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      id: beneficiaryId,
      supportPrograms: [{ id: v4(), name: 'UDT-Ancien dispositif' }]
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      id: beneficiaryId,
      supportPrograms: [{ id: v4(), name: 'UDT-Nouveau dispositif' }]
    })

    const supportPrograms = await prismaClient.supportProgram.findMany({
      where: { beneficiaryId },
      include: { supportProgramName: true }
    })
    expect(supportPrograms).toHaveLength(1)
    expect(supportPrograms[0]!.supportProgramName.name).toBe(
      'UDT-Nouveau dispositif'
    )
  })

  test('Le nom de dispositif est créé sil nexiste pas encore', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      id: beneficiaryId,
      supportPrograms: [{ id: v4(), name: 'UDT-Nouveau nom' }]
    })

    const supportProgramName = await prismaClient.supportProgramName.findUnique(
      {
        where: {
          structureId_name: { structureId, name: 'UDT-Nouveau nom' }
        }
      }
    )
    expect(supportProgramName).not.toBeNull()
  })

  test('Un Referent peut modifier les dispositifs dun bénéficiaire dont il est référent', async ({
    trpc
  }) => {
    const result = await trpc.referent.beneficiary.updateSupportPrograms({
      id: beneficiaryId,
      supportPrograms: [{ id: v4(), name: 'UDT-Dispositif référent' }]
    })
    expect(result.id).toBe(beneficiaryId)
  })

  test('Les champs optionnels sont correctement enregistrés', async ({
    trpc
  }) => {
    const supportProgramId = v4()
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-06-30')

    const partnerOrganisation = await prismaClient.partnerOrganization.create({
      data: { structureId, name: 'CCAS-UDT' },
      select: { id: true }
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      id: beneficiaryId,
      supportPrograms: [
        {
          id: supportProgramId,
          name: 'UDT-Dispositif complet',
          startDate,
          endDate,
          exitReason: 'Fin de prise en charge',
          partnerOrganisationId: partnerOrganisation.id,
          precisions: 'Intervenant : M. Dupont'
        }
      ]
    })

    const supportProgram = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId }
    })
    expect(supportProgram?.startDate).toEqual(startDate)
    expect(supportProgram?.endDate).toEqual(endDate)
    expect(supportProgram?.exitReason).toBe('Fin de prise en charge')
    expect(supportProgram?.partnerOrganisationId).toBe(partnerOrganisation.id)
    expect(supportProgram?.precisions).toBe('Intervenant : M. Dupont')

    await prismaClient.partnerOrganization.deleteMany({
      where: { id: partnerOrganisation.id }
    })
  })
})
