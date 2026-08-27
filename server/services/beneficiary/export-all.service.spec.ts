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
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesPartnerOrganizations,
  FixturePartnerOrganization
} from '~~/prisma/fixtures'

const FILE_NUMBER = '87MB42GCB5'

const input: ExportBeneficiariesInput = {
  code: '',
  filters: {},
  orderBy: {}
}

let familyFileId: string
let beneficiaryId: string
let supportProgramNameIds: string[] = []

beforeEach(async () => {
  const date = new Date('2020-11-25')
  const familyFile = await createFamilyFile(date)
  familyFileId = familyFile.id
  const beneficiary = await createBeneficiary(date, familyFileId)
  beneficiaryId = beneficiary.id
  supportProgramNameIds = await createSupportPrograms(beneficiaryId)
})

afterEach(async () => {
  await prismaClient.beneficiary.delete({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.delete({ where: { id: familyFileId } })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: { in: supportProgramNameIds } }
  })
  supportProgramNameIds.length = 0
})

/**
 * Enroll the beneficiary in two support programs: one with a lifecycle
 * (dates and outcome are exported) and one without (they are not).
 * Returns the ids of the created program names, to be cleaned up afterwards.
 */
async function createSupportPrograms(beneficiaryId: string) {
  const supportProgramName = await createSupportProgramName(
    'Accompagnement budgétaire',
    true
  )
  const noLifecycleProgramName = await createSupportProgramName(
    'Portage de repas ponctuel',
    false
  )
  await prismaClient.supportProgram.create({
    data: {
      beneficiaryId,
      supportProgramNameId: supportProgramName.id,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-09-15'),
      exitReason: 'Déménagement',
      outcome: 'PartiallyAchieved',
      partnerOrganisations: {
        connect: [
          {
            id: fixturesPartnerOrganizations[
              FixturePartnerOrganization.FranceTravail
            ].id
          },
          {
            id: fixturesPartnerOrganizations[
              FixturePartnerOrganization.MairieValence
            ].id
          }
        ]
      }
    }
  })
  await prismaClient.supportProgram.create({
    data: {
      beneficiaryId,
      supportProgramNameId: noLifecycleProgramName.id,
      startDate: new Date('2025-04-01'),
      outcome: 'Achieved'
    }
  })
  return [supportProgramName.id, noLifecycleProgramName.id]
}

function createSupportProgramName(name: string, hasLifecycle: boolean) {
  return prismaClient.supportProgramName.create({
    data: {
      name,
      hasLifecycle,
      structureId: fixtureStructures[FixtureStructure.Test].id,
      createdById: fixturesUsers[FixtureUserRole.StructureManager].id
    }
  })
}

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

describe('Beneficiary - Export All Service - Support programs worksheet', () => {
  test('should list one row per support program', async ({ users }) => {
    const ctx = createSecurityContext(users.structureManager)

    const workbook = await exportWorkbook({ ctx, input })
    const worksheet = workbook.getWorksheet('Dispositifs')

    expect(worksheet).toBeDefined()
    expect(worksheet?.getRow(1).values).toEqual([
      undefined,
      'N° dossier bénéficiaire',
      'Nom du dispositif',
      'Organismes partenaires',
      "Date d'entrée",
      'Date de sortie',
      'Atteinte des objectifs'
    ])
    expect(
      readSupportProgramRows(worksheet).filter(
        row => row.fileNumber === FILE_NUMBER
      )
    ).toEqual([
      {
        fileNumber: FILE_NUMBER,
        name: 'Accompagnement budgétaire',
        partnerOrganisations: 'France Travail / Mairie de Valence',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-09-15'),
        outcome: 'Partiel'
      },
      {
        // the program name has no lifecycle: dates and outcome are empty
        fileNumber: FILE_NUMBER,
        name: 'Portage de repas ponctuel',
        partnerOrganisations: '',
        startDate: '',
        endDate: '',
        outcome: ''
      }
    ])
  })

  test('should not list support programs of another structure', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.structureManagerMinistere)

    const workbook = await exportWorkbook({ ctx, input })
    const worksheet = workbook.getWorksheet('Dispositifs')

    expect(
      readSupportProgramRows(worksheet).filter(
        row => row.fileNumber === FILE_NUMBER
      )
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

/** Read the data rows of the support programs worksheet, header row excluded */
const readSupportProgramRows = (worksheet: Worksheet | undefined) => {
  const rows: {
    fileNumber: unknown
    name: unknown
    partnerOrganisations: unknown
    startDate: unknown
    endDate: unknown
    outcome: unknown
  }[] = []
  worksheet?.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }
    rows.push({
      fileNumber: row.getCell('beneficiaryFileNumber').value,
      name: row.getCell('name').value,
      partnerOrganisations: row.getCell('partnerOrganisations').value,
      startDate: row.getCell('startDate').value,
      endDate: row.getCell('endDate').value,
      outcome: row.getCell('outcome').value
    })
  })
  return rows
}
