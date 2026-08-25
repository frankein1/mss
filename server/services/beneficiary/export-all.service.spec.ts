/**
 * Test the export service instead of the query in order to inspect the
 * generated worksheets as js objects and not as an excel file
 */
import { describe, expect, beforeEach, afterEach } from 'vitest'
import type { Row, Worksheet } from 'exceljs'
import { exportWorkbook } from './export-all.service'
import { createSecurityContext, test } from '~~/test/server/test-utils'
import type { ExportBeneficiariesInput } from '~~/server/schema'
import { prismaClient } from '~~/server/prisma'
import { createFamilyFile } from '~~/test/server/fixtures/familyFiles'
import { createBeneficiary } from '~~/test/server/fixtures/beneficiaries'

const FILE_NUMBER = '87MB42GCB5'

const input: ExportBeneficiariesInput = {
  code: '',
  filters: {},
  orderBy: {}
}

let familyFileId: string
let beneficiaryId: string

beforeEach(async () => {
  const date = new Date('2020-11-25')
  const familyFile = await createFamilyFile(date)
  familyFileId = familyFile.id
  const beneficiary = await createBeneficiary(date, familyFileId)
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.beneficiary.delete({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.delete({ where: { id: familyFileId } })
})

describe('Beneficiary - Export All Service - Contributing partners worksheet', () => {
  test('should list one row per contributing partner', async ({ users }) => {
    const ctx = createSecurityContext(users.structureManager)

    const workbook = await exportWorkbook({ ctx, input })
    const worksheet = workbook.getWorksheet('Partenaires intervenants')

    expect(worksheet).toBeDefined()
    expect(worksheet?.getRow(1).values).toEqual([
      undefined,
      'N° dossier bénéficiaire',
      'Partenaire intervenant',
      'Contact du partenaire intervenant',
      'Précisions'
    ])
    expect(
      readRows(worksheet).filter(row => row.fileNumber === FILE_NUMBER)
    ).toEqual([
      {
        fileNumber: FILE_NUMBER,
        partner: 'France Travail',
        contact: 'Martine de France Travail',
        precisions: 'Accompagnement vers le retour à l’emploi'
      },
      {
        fileNumber: FILE_NUMBER,
        partner: 'Mairie de Valence',
        contact: '',
        precisions: ''
      }
    ])
  })

  test('should not list contributing partners of another structure', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManagerMinistere)

    const workbook = await exportWorkbook({ ctx, input })
    const worksheet = workbook.getWorksheet('Partenaires intervenants')

    expect(
      readRows(worksheet).filter(row => row.fileNumber === FILE_NUMBER)
    ).toHaveLength(0)
  })
})

describe('Beneficiary - Export All Service - External organisations columns', () => {
  test('should export the external organisations of the beneficiary', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManager)

    const workbook = await exportWorkbook({ ctx, input })
    const worksheet = workbook.getWorksheet('Bénéficiaires')
    const row = findRowByFileNumber(worksheet, FILE_NUMBER)

    expect(row?.getCell('protectionMeasure').value).toBe('Curatelle renforcée')
    expect(row?.getCell('representative').value).toBe('Parent')
    expect(row?.getCell('prescribingOrganizationId').value).toBe('CAF 26')
    expect(row?.getCell('prescribingOrganizationContactId').value).toBe(
      'Sandrine de la CAF 26'
    )
    expect(row?.getCell('orientationType').value).toBe(
      'Orientation Département'
    )
    expect(row?.getCell('orientationStructure').value).toBe('CCAS de Lyon 6')
  })
})

/** Find the data row of a beneficiary, header row excluded */
const findRowByFileNumber = (
  worksheet: Worksheet | undefined,
  fileNumber: string
) => {
  let found: Row | undefined
  worksheet?.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }
    if (row.getCell('fileNumber').value === fileNumber) {
      found = row
    }
  })
  return found
}

/** Read the data rows of a worksheet, header row excluded */
const readRows = (worksheet: Worksheet | undefined) => {
  const rows: {
    fileNumber: unknown
    partner: unknown
    contact: unknown
    precisions: unknown
  }[] = []
  worksheet?.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }
    rows.push({
      fileNumber: row.getCell('beneficiaryFileNumber').value,
      partner: row.getCell('partnerOrganizationName').value,
      contact: row.getCell('partnerOrganizationContactName').value,
      precisions: row.getCell('precisions').value
    })
  })
  return rows
}
