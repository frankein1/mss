/**
 * Test the export service instead of the query in order to validate the output
 * as a js object and not an excel file
 */
import { describe, expect, beforeAll } from 'vitest'
import { createSecurityContext, test } from '~~/test/server/test-utils'
import { exportFileInstructions } from './export.service'
import type { ExportFileInstructionsInput } from '~~/server/schema'
import { rowsToCsv } from '~/utils/export/createExport'
import { prismaClient } from '~~/server/prisma'
import { FileInstructionPeriodFilter } from '~~/types/fileInstruction'
import { parseCsvReference } from '~~/test/server/helper'

let fixtureDate: Date
beforeAll(async () => {
  const res = await prismaClient.structure.findFirst({
    select: { created: true }
  })
  if (!res?.created) {
    throw new Error('no data seed is present')
  }
  fixtureDate = res.created
})

const orderBy = { socialSupport: { date: 'desc' } } as const

describe.skip('FileInstruction - Export Service', () => {
  test('should export all file instructions with no regression in content', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: {},
      orderBy
    }

    const res = await exportFileInstructions({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)
    expect(csv).toBe(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/file-instruction-export/export-all.csv'
      )
    )
  })

  test('should export filtered rows when exporting with fileInstructionType filter Other', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: { fileInstructionType: 'Other' },
      orderBy
    }
    const res = await exportFileInstructions({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)
    expect(csv).toBe(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/file-instruction-export/export-type-other.csv'
      )
    )
  })

  test('should return empty rows when exporting with status filter not contained in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: { status: 'Adjourned' },
      orderBy: {}
    }
    const { rows } = await exportFileInstructions({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should export filtered rows when exporting with status filter present in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: { status: 'InvestigationOngoing' },
      orderBy
    }

    const res = await exportFileInstructions({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)

    expect(csv).toBe(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/file-instruction-export/export-status-investigation-ongoing.csv'
      )
    )
  })

  test('should export filtered rows when exporting with date range filter present in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: {
        period: FileInstructionPeriodFilter.Custom,
        fromDate: new Date('2022-01-01'),
        toDate: new Date('2022-12-31')
      },
      orderBy
    }

    const res = await exportFileInstructions({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)

    expect(csv).toEqual(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/file-instruction-export/export-date-2022.csv'
      )
    )
  })

  test('should return empty rows when exporting with date range filter not contained in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: {
        period: FileInstructionPeriodFilter.Custom,
        fromDate: new Date('2030-01-01')
      },
      orderBy
    }
    const { rows } = await exportFileInstructions({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should return empty rows when exporting data from another structure', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManagerMinistere)
    const input: ExportFileInstructionsInput = {
      code: '',
      filters: {},
      orderBy
    }

    const { rows } = await exportFileInstructions({ ctx, input })

    expect(rows).toHaveLength(0)
  })
})
