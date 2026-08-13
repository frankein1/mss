/**
 * Test the export service instead of the query in order to validate the output
 * as a js object and not an excel file
 */
import { describe, expect, beforeAll } from 'vitest'
import { createSecurityContext, test } from '~~/test/server/test-utils'
import { exportFollowups } from './export.service'
import type { ExportFollowupsInput } from '~~/server/schema'
import { rowsToCsv } from '~/utils/export/createExport'
import { prismaClient } from '~~/server/prisma'
import { FollowupPeriodFilter } from '~~/types/followup'
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

describe.skip('Followup - Export Service', () => {
  test('should export all followups with no regression in content', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFollowupsInput = { code: '', filters: {}, orderBy }

    const res = await exportFollowups({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)
    expect(csv).toBe(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/followup-export/export-all.csv'
      )
    )
  })

  test('should return empty rows when exporting with status filter not contained in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFollowupsInput = {
      code: '',
      filters: { status: 'Adjourned' },
      orderBy: {}
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should export filtered rows when exporting with status filter present in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFollowupsInput = {
      code: '',
      filters: { status: 'InProgress' },
      orderBy
    }

    const res = await exportFollowups({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)
    expect(csv).toBe(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/followup-export/export-status-in-progress.csv'
      )
    )
  })

  test('should export filtered rows when exporting with date range filter present in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFollowupsInput = {
      code: '',
      filters: {
        period: FollowupPeriodFilter.Custom,
        fromDate: new Date('2022-10-01'),
        toDate: new Date('2022-10-23')
      },
      orderBy
    }

    const res = await exportFollowups({ ctx, input })

    const csv = await rowsToCsv(res.columns, res.rows)
    expect(csv).toBe(
      await parseCsvReference(
        fixtureDate,
        'test/server/references/followup-export/export-date-2022.csv'
      )
    )
  })

  test('should return empty rows when exporting with date range filter not contained in data', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)
    const input: ExportFollowupsInput = {
      code: '',
      filters: {
        period: FollowupPeriodFilter.Custom,
        fromDate: new Date('2023-01-01')
      },
      orderBy
    }
    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(0)
  })

  test('should return empty rows when exporting data from another structure', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManagerMinistere)
    const input: ExportFollowupsInput = { code: '', filters: {}, orderBy }

    const { rows } = await exportFollowups({ ctx, input })

    expect(rows).toHaveLength(0)
  })
})
