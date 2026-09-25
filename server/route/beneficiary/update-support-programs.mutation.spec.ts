import { SupportProgramOutcome } from '@prisma/client'
import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

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
  'USP-Dispositif modifié',
  'USP-Axe intervention'
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
    const isNonLifecycle = name === 'USP-Axe intervention'
    const spn = await prismaClient.supportProgramName.create({
      data: {
        name,
        hasLifecycle: !isNonLifecycle,
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
            id: crypto.randomUUID(),
            supportProgramNameId: supportProgramNameIds[0]!,
            partnerOrganisationIds: [foreignPartnerOrg.id]
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
            id: crypto.randomUUID(),
            supportProgramNameId: foreignName.id
          }
        ]
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Support Programs - Update - CRUD', () => {
  test('A StructureManager can add support programs', async ({ trpc }) => {
    const supportProgramId = crypto.randomUUID()
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
    const existingId = crypto.randomUUID()
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: existingId,
          supportProgramNameId: supportProgramNameIds[1]!
        },
        {
          id: crypto.randomUUID(),
          supportProgramNameId: supportProgramNameIds[5]!
        }
      ]
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: existingId,
          supportProgramNameId: supportProgramNameIds[1]!
        },
        {
          id: crypto.randomUUID(),
          supportProgramNameId: supportProgramNameIds[2]!
        }
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
    const programId = crypto.randomUUID()
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
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30'),
          outcome: SupportProgramOutcome.Achieved
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
      outcome: SupportProgramOutcome.Achieved
    })
  })

  test('A Referent can update support programs for a beneficiary they are referent of', async ({
    trpc
  }) => {
    const result = await trpc.referent.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: crypto.randomUUID(),
          supportProgramNameId: supportProgramNameIds[3]!
        }
      ]
    })
    expect(result.id).toBe(beneficiaryId)
  })

  test('Optional fields are correctly saved', async ({ trpc }) => {
    const supportProgramId = crypto.randomUUID()
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
          partnerOrganisationIds: [partnerOrganisation.id],
          outcome: SupportProgramOutcome.SubjectToConditions
        }
      ]
    })

    const supportProgram = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId },
      select: {
        startDate: true,
        endDate: true,
        exitReason: true,
        outcome: true,
        partnerOrganisations: { select: { id: true } }
      }
    })
    expect(supportProgram?.startDate).toEqual(startDate)
    expect(supportProgram?.endDate).toEqual(endDate)
    expect(supportProgram?.exitReason).toBe('Fin de prise en charge')
    expect(supportProgram?.partnerOrganisations).toEqual([
      { id: partnerOrganisation.id }
    ])
    expect(supportProgram?.outcome).toBe(
      SupportProgramOutcome.SubjectToConditions
    )
  })

  test('Multiple partner organisations can be assigned and updated', async ({
    trpc
  }) => {
    const supportProgramId = crypto.randomUUID()

    const [org1, org2, org3] = await Promise.all([
      prismaClient.partnerOrganization.create({
        data: { structureId, name: 'USP-CAF' },
        select: { id: true }
      }),
      prismaClient.partnerOrganization.create({
        data: { structureId, name: 'USP-CPAM' },
        select: { id: true }
      }),
      prismaClient.partnerOrganization.create({
        data: { structureId, name: 'USP-MSA' },
        select: { id: true }
      })
    ])

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: supportProgramNameIds[0]!,
          partnerOrganisationIds: [org1.id, org2.id]
        }
      ]
    })

    let sp = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId },
      select: { partnerOrganisations: { select: { id: true } } }
    })
    expect(sp?.partnerOrganisations).toHaveLength(2)
    expect(sp?.partnerOrganisations.map(o => o.id).sort()).toEqual(
      [org1.id, org2.id].sort()
    )

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: supportProgramNameIds[0]!,
          partnerOrganisationIds: [org2.id, org3.id]
        }
      ]
    })

    sp = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId },
      select: { partnerOrganisations: { select: { id: true } } }
    })
    expect(sp?.partnerOrganisations).toHaveLength(2)
    expect(sp?.partnerOrganisations.map(o => o.id).sort()).toEqual(
      [org2.id, org3.id].sort()
    )
  })

  test('Empty array clears all partner organisations', async ({ trpc }) => {
    const supportProgramId = crypto.randomUUID()

    const org = await prismaClient.partnerOrganization.create({
      data: { structureId, name: 'USP-Clear' },
      select: { id: true }
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: supportProgramNameIds[0]!,
          partnerOrganisationIds: [org.id]
        }
      ]
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: supportProgramNameIds[0]!,
          partnerOrganisationIds: []
        }
      ]
    })

    const sp = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId },
      select: { partnerOrganisations: { select: { id: true } } }
    })
    expect(sp?.partnerOrganisations).toEqual([])
  })
})

describe('Support Programs - Update - Outcome', () => {
  test('Outcome is persisted when endDate is present', async ({ trpc }) => {
    const programId = crypto.randomUUID()
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: programId,
          supportProgramNameId: supportProgramNameIds[0]!,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          outcome: SupportProgramOutcome.Achieved
        }
      ]
    })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: programId }
    })
    expect(program?.outcome).toBe(SupportProgramOutcome.Achieved)
  })

  test('Outcome is persisted when endDate is absent', async ({ trpc }) => {
    const programId = crypto.randomUUID()
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: programId,
          supportProgramNameId: supportProgramNameIds[0]!,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          outcome: SupportProgramOutcome.Exceeded
        }
      ]
    })

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: programId,
          supportProgramNameId: supportProgramNameIds[0]!,
          outcome: SupportProgramOutcome.Exceeded
        }
      ]
    })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: programId }
    })
    expect(program?.endDate).toBeNull()
    expect(program?.outcome).toBe(SupportProgramOutcome.Exceeded)
  })

  test('Outcome is optional when endDate is present', async ({ trpc }) => {
    const programId = crypto.randomUUID()
    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: programId,
          supportProgramNameId: supportProgramNameIds[0]!,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        }
      ]
    })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: programId }
    })
    expect(program?.outcome).toBeNull()
  })
})

describe('Support Programs - Update - Lifecycle Enforcement', () => {
  test('Lifecycle data is rejected for a non-lifecycle name', async ({
    trpc
  }) => {
    const nonLifecycleNameId = supportProgramNameIds[7]!

    await expect(
      trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: crypto.randomUUID(),
            supportProgramNameId: nonLifecycleNameId,
            startDate: new Date('2024-01-01')
          }
        ]
      })
    ).rejects.toThrow(/lifecycle data is not allowed/i)
  })

  test('EndDate is rejected for a non-lifecycle name', async ({ trpc }) => {
    const nonLifecycleNameId = supportProgramNameIds[7]!

    await expect(
      trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: crypto.randomUUID(),
            supportProgramNameId: nonLifecycleNameId,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31')
          }
        ]
      })
    ).rejects.toThrow(/lifecycle data is not allowed/i)
  })

  test('ExitReason is rejected for a non-lifecycle name', async ({ trpc }) => {
    const nonLifecycleNameId = supportProgramNameIds[7]!

    await expect(
      trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: crypto.randomUUID(),
            supportProgramNameId: nonLifecycleNameId,
            exitReason: 'Fin de parcours'
          }
        ]
      })
    ).rejects.toThrow(/lifecycle data is not allowed/i)
  })

  test('Non-lifecycle name without lifecycle data is accepted', async ({
    trpc
  }) => {
    const nonLifecycleNameId = supportProgramNameIds[7]!
    const supportProgramId = crypto.randomUUID()

    const result =
      await trpc.structureManager.beneficiary.updateSupportPrograms({
        ...baseInput(),
        supportPrograms: [
          {
            id: supportProgramId,
            supportProgramNameId: nonLifecycleNameId
          }
        ]
      })

    expect(result.id).toBe(beneficiaryId)

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId }
    })
    expect(program?.startDate).toBeNull()
    expect(program?.endDate).toBeNull()
  })

  test('Outcome is accepted for a non-lifecycle name', async ({ trpc }) => {
    const nonLifecycleNameId = supportProgramNameIds[7]!
    const supportProgramId = crypto.randomUUID()

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: nonLifecycleNameId,
          outcome: SupportProgramOutcome.Achieved
        }
      ]
    })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId }
    })
    expect(program?.outcome).toBe(SupportProgramOutcome.Achieved)
  })

  test('Lifecycle name with lifecycle data is accepted', async ({ trpc }) => {
    const lifecycleNameId = supportProgramNameIds[0]!
    const supportProgramId = crypto.randomUUID()

    await trpc.structureManager.beneficiary.updateSupportPrograms({
      ...baseInput(),
      supportPrograms: [
        {
          id: supportProgramId,
          supportProgramNameId: lifecycleNameId,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          outcome: SupportProgramOutcome.Achieved
        }
      ]
    })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: supportProgramId }
    })
    expect(program?.startDate).toEqual(new Date('2024-01-01'))
    expect(program?.endDate).toEqual(new Date('2024-12-31'))
    expect(program?.outcome).toBe(SupportProgramOutcome.Achieved)
  })
})
