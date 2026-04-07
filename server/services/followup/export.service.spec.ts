import { describe, expect, afterEach, beforeEach } from 'vitest'
import { prismaClient } from '~/server/prisma'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import type { SecurityRuleContext } from '~/server/security'
import { exportFollowups } from './export.service'
import type { ExportFollowupsInput } from '~/server/schema'
import { createFamilyFile } from '~/test/server/fixtures/familyFiles'
import { createBeneficiary } from '~/test/server/fixtures/beneficiaries'
import { createSocialSupports } from '~/test/server/fixtures/socialSupports'

let familyFileId: string
let beneficiaryId: string

const ctx: SecurityRuleContext = {
  user: {
    id: fixturesUsers[FixtureUserRole.StructureManager].id,
    role: 'StructureManager',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  structure: {
    id: fixtureStructures[FixtureStructure.Test].id,
    type: 'Ccas',
    externalRdvspActive: null
  }
}

beforeEach(async () => {
  const date = new Date('2023-06-15')
  const file = await createFamilyFile(date)
  familyFileId = file.id
  const ben = await createBeneficiary(date, familyFileId)
  beneficiaryId = ben.id
  await createSocialSupports(date, familyFileId, beneficiaryId)
})

afterEach(async () => {
  if (beneficiaryId) {
    await prismaClient.beneficiary.delete({ where: { id: beneficiaryId } })
  }
  if (familyFileId) {
    await prismaClient.familyFile.delete({ where: { id: familyFileId } })
  }
})

describe('Followup - Export Service', () => {
  test('should build columns array with 28 fields', async () => {
    const input: ExportFollowupsInput = {
      filters: {},
      orderBy: {}
    }
    const { columns } = await exportFollowups({ ctx, input })

    expect(columns).toHaveLength(28)
    // First column from FOLLOWUP_EXPORTED_FIELDS
    expect(columns[0]).toEqual({
      key: 'status',
      header: expect.any(String)
    })
    // Last column from REDIRECTION_EXPORTED_FIELDS
    expect(columns[27]).toEqual({
      key: 'externalStructureName',
      header: expect.any(String)
    })
  })

  test('should export a followup row with formatted fields', async () => {
    const input: ExportFollowupsInput = {
      filters: {},
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(1)
    const row = rows[0]

    // Verify date formatting
    expect(row.date).toBe('15-06-2023')

    // Verify boolean conversions
    expect(row.firstFollowup).toBeTruthy()
    expect(row.classified).toBeTruthy()
    expect(row.forwardedToJustice).toBeTruthy()
    expect(row.helpRequested).toBeTruthy()

    // Verify enum labels are present
    expect(row.medium).toBeTruthy()
    expect(row.status).toBeTruthy()
    expect(row.duration).toBeTruthy()

    // Verify string passthroughs
    expect(row.synthesis).toBe('Synthesis')
    expect(row.place).toBe('CCAS de Lyon')
    expect(row.structureName).toBe('CCAS de Lyon')
    expect(row.thirdPersonName).toBe('Mme Dubois')
    expect(row.numeroPegase).toBe('12345ABCD')

    // Verify beneficiary fields
    expect(row.beneficiaryLastName).toBe('Attaque')
    expect(row.beneficiaryFirstName).toBe('Louise')
    expect(row.beneficiaryFileNumber).toBe('87MB42GCB5')

    // Verify prescribing organization is present
    expect(row.prescribingOrganizationId).toBeTruthy()

    // Verify empty fields
    expect(row.dueDate).toBe('')
    expect(row.subjects).toBe('')
    expect(row.type).toBe('')
    expect(row.motif).toBe('')
    expect(row.partnerOrganizationId).toBe('')
    expect(row.partnerOrganizationContactId).toBe('')
    expect(row.externalStructureName).toBe('')
  })

  test('should return empty rows with no-match filter', async () => {
    const input: ExportFollowupsInput = {
      filters: { status: 'Closed' },
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should filter by status - matching', async () => {
    const input: ExportFollowupsInput = {
      filters: { status: 'InProgress' },
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(1)
  })

  test('should filter by status - non-matching', async () => {
    const input: ExportFollowupsInput = {
      filters: { status: 'Refused' },
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should filter by date range - matching', async () => {
    const input: ExportFollowupsInput = {
      filters: {
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-12-31')
      },
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(1)
  })

  test('should filter by date range - non-matching', async () => {
    const input: ExportFollowupsInput = {
      filters: {
        fromDate: new Date('2024-01-01')
      },
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should respect structure isolation', async () => {
    const ctxMinistere: SecurityRuleContext = {
      user: {
        id: fixturesUsers[FixtureUserRole.StructureManagerMinistere].id,
        role: 'StructureManager',
        status: 'Active',
        structureId: fixtureStructures[FixtureStructure.Ministère].id
      },
      structure: {
        id: fixtureStructures[FixtureStructure.Ministère].id,
        type: 'Ministere',
        externalRdvspActive: null
      }
    }

    const input: ExportFollowupsInput = {
      filters: {},
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx: ctxMinistere, input })

    // Should see no followups because created followup is in Test structure
    expect(rows).toHaveLength(0)
  })
})
