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
const otherStructureId = fixtureStructures[FixtureStructure.Ministère].id

const SUPPORT_PROGRAM_NAMES_USED = [
  'USP-Portage de repas',
  'USP-Ancien dispositif',
  'USP-Nouveau dispositif',
  'USP-Dispositif référent',
  'USP-Dispositif complet',
  'USP-Dispositif existant',
  'USP-Dispositif modifié'
]

let supportProgramNameIds: string[] = []

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
      fileNumber: 'TEST-USP-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  supportProgramNameIds = []
  for (const name of SUPPORT_PROGRAM_NAMES_USED) {
    const spn = await prismaClient.supportProgramName.create({
      data: {
        name,
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: socialWorkerId } }
      }
    })
    supportProgramNameIds.push(spn.id)
  }
})

afterEach(async () => {
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { name: { startsWith: 'USP-' } }
  })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.partnerOrganization.deleteMany({
    where: { name: { startsWith: 'USP-' } }
  })
})

const baseInput = () => ({
  id: beneficiaryId,
  supportPrograms: []
})

describe('Support Programs - Update - Authorizations', () => {
  test('A ReceptionAgent cannot update support programs', async ({ trpc }) => {
    await expect(
      trpc.receptionAgent.beneficiary.updateSupportPrograms(baseInput())
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A user from another structure cannot update support programs', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.beneficiary.updateSupportPrograms(
        baseInput()
      )
    ).rejects.toThrow(/no record/i)
  })

  test('A StructureManager cannot create a support program with a partner organisation from another structure', async ({
    trpc
  }) => {
    const foreignPartnerOrg = await prismaClient.partnerOrganization.create({
      data: { structureId: otherStructureId, name: 'USP-Foreign' },
      select: { id: true }
    })

    await expect(
      trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: v4(),
            supportProgramNameId: supportProgramNameIds[0]!,
            partnerOrganisationId: foreignPartnerOrg.id
          }
        ]
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A StructureManager cannot create a support program with a supportProgramNameId from another structure', async ({
    trpc
  }) => {
    const foreignName = await prismaClient.supportProgramName.create({
      data: {
        name: 'USP-Foreign-Name',
        structureId: otherStructureId,
        createdById: socialWorkerId
      },
      select: { id: true }
    })

    await expect(
      trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: v4(),
            supportProgramNameId: foreignName.id
          }
        ]
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Support Programs - Update - CRUD', () => {
  test('A StructureManager can add support programs', async ({ trpc }) => {
    const supportProgramId = v4()
    const result =
      await trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: supportProgramId,
            supportProgramNameId: supportProgramNameIds[0]!
          }
        ]
      })

    expect(result.id).toBe(beneficiaryId)

    const supportPrograms = await prismaClient.supportProgram.findMany({
      where: { beneficiaryId },
      // eslint-disable-next-line no-restricted-syntax
      include: { supportProgramName: true }
    })
    expect(supportPrograms).toHaveLength(1)
    expect(supportPrograms[0]!.supportProgramName.name).toBe(
      'USP-Portage de repas'
    )
  })

  test('Updating preserves existing programs and removes deleted ones', async ({
    trpc
  }) => {
    const existingId = v4()
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: existingId,
          supportProgramNameId: supportProgramNameIds[1]!
        },
        { id: v4(), supportProgramNameId: supportProgramNameIds[5]! }
      ]
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: existingId,
          supportProgramNameId: supportProgramNameIds[1]!
        },
        { id: v4(), supportProgramNameId: supportProgramNameIds[2]! }
      ]
    })

    const supportPrograms = await prismaClient.supportProgram.findMany({
      where: { beneficiaryId },
      // eslint-disable-next-line no-restricted-syntax
      include: { supportProgramName: true }
    })
    expect(supportPrograms).toHaveLength(2)

    const existing = supportPrograms.find(sp => sp.id === existingId)
    expect(existing).toBeDefined()
    expect(existing!.supportProgramName.name).toBe('USP-Ancien dispositif')

    const names = supportPrograms.map(sp => sp.supportProgramName.name)
    expect(names).toContain('USP-Nouveau dispositif')
    expect(names).not.toContain('USP-Dispositif existant')
  })

  test('Existing program fields can be updated in place', async ({ trpc }) => {
    const programId = v4()
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        { id: programId, supportProgramNameId: supportProgramNameIds[5]! }
      ]
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: programId,
          supportProgramNameId: supportProgramNameIds[6]!,
          precisions: 'Updated precisions'
        }
      ]
    })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: programId },
      // eslint-disable-next-line no-restricted-syntax
      include: { supportProgramName: { select: { name: true } } }
    })
    expect(program).toMatchObject({
      id: programId,
      supportProgramName: { name: 'USP-Dispositif modifié' },
      precisions: 'Updated precisions'
    })
  })

  test('A Referent can update support programs for a beneficiary they are referent of', async ({
    trpc
  }) => {
    const result = await trpc.referent.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        { id: v4(), supportProgramNameId: supportProgramNameIds[3]! }
      ]
    })
    expect(result.id).toBe(beneficiaryId)
  })

  test('Optional fields are correctly saved', async ({ trpc }) => {
    const supportProgramId = v4()
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-06-30')

    const partnerOrganisation = await prismaClient.partnerOrganization.create({
      data: { structureId, name: 'USP-CCAS' },
      select: { id: true }
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: supportProgramNameIds[4]!,
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
  })
})
