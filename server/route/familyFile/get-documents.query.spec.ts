import { afterEach, beforeEach, describe, expect } from 'vitest'
import type { DocumentType } from '@prisma/client'
import type { inferProcedureInput } from '@trpc/server'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesFamilyFiles,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { test } from '~/test/server/test-utils'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['file']['getDocuments']>

const FAMILY_FILE_ID = fixturesFamilyFiles[FixtureBeneficiary.TEARLE].id
const BENEFICIARY_ID = fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id
const CREATED_BY_ID = fixturesUsers[FixtureUserRole.StructureManager].id

const SOCIAL_WORKER_ID = fixturesUsers[FixtureUserRole.SocialWorker].id
const RECEPTION_AGENT_ID = fixturesUsers[FixtureUserRole.ReceptionAgent].id

const PENSON_FAMILY_FILE_ID = fixturesFamilyFiles[FixtureBeneficiary.PENSON].id
const PENSON_BENEFICIARY_ID =
  fixturesBeneficiaries[FixtureBeneficiary.PENSON].id

const COURSOR_FAMILY_FILE_ID =
  fixturesFamilyFiles[FixtureBeneficiary.COURSOR].id
const COURSOR_BENEFICIARY_ID =
  fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id

const OTHER_STRUCTURE_FAMILY_FILE_ID =
  fixturesFamilyFiles[FixtureBeneficiary.MARTIN].id

const createdDocumentKeys: string[] = []

async function createDocument(
  overrides: Partial<{
    familyFileId: string
    beneficiaryId: string
    createdById: string
    type: DocumentType
    tags: string[]
    confidential: boolean
    name: string
  }> = {}
) {
  const doc = await prismaClient.document.create({
    select: { key: true },
    data: {
      name: overrides.name ?? `test-doc-${Date.now()}`,
      mimeType: 'application/pdf',
      filenameDisk: `disk-${Date.now()}`,
      type: overrides.type ?? 'Justificatifs',
      tags: overrides.tags ?? [],
      confidential: overrides.confidential ?? false,
      familyFileId: overrides.familyFileId ?? FAMILY_FILE_ID,
      beneficiaryId: overrides.beneficiaryId ?? BENEFICIARY_ID,
      createdById: overrides.createdById ?? CREATED_BY_ID
    }
  })
  createdDocumentKeys.push(doc.key)
  return doc
}

afterEach(async () => {
  if (createdDocumentKeys.length > 0) {
    await prismaClient.document.deleteMany({
      where: { key: { in: createdDocumentKeys } }
    })
    createdDocumentKeys.length = 0 // empty array in place
  }
})

describe('Authorizations', () => {
  beforeEach(() => createDocument())

  test('should reject administrator', async ({ trpc }) => {
    const input: Input = { familyFileId: FAMILY_FILE_ID }
    await expect(
      trpc.administrator.file.getDocuments(input)
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })

  test('should reject user from another structure', async ({ trpc }) => {
    const input: Input = { familyFileId: FAMILY_FILE_ID }
    await expect(
      trpc.structureManagerMinistere.file.getDocuments(input)
    ).rejects.toThrowError(/no record/i)
  })

  test('should allow structure manager', async ({ trpc }) => {
    const input: Input = { familyFileId: FAMILY_FILE_ID }
    const result = await trpc.structureManager.file.getDocuments(input)
    expect(result.documents.length).toBeGreaterThanOrEqual(1)
  })

  test('should allow social worker', async ({ trpc }) => {
    const input: Input = { familyFileId: FAMILY_FILE_ID }
    const result = await trpc.socialWorker.file.getDocuments(input)
    expect(result.documents.length).toBeGreaterThanOrEqual(1)
  })

  test('should allow instructor', async ({ trpc }) => {
    const input: Input = { familyFileId: FAMILY_FILE_ID }
    const result = await trpc.instructor.file.getDocuments(input)
    expect(result.documents.length).toBeGreaterThanOrEqual(1)
  })

  test('should allow reception agent to see documents they created', async ({
    trpc
  }) => {
    await createDocument({
      familyFileId: PENSON_FAMILY_FILE_ID,
      beneficiaryId: PENSON_BENEFICIARY_ID,
      createdById: RECEPTION_AGENT_ID
    })

    const input: Input = { familyFileId: PENSON_FAMILY_FILE_ID }
    const result = await trpc.receptionAgent.file.getDocuments(input)
    expect(result.documents.length).toBeGreaterThanOrEqual(1)
  })

  test('should not return documents created by another user to reception agent', async ({
    trpc
  }) => {
    const { key } = await createDocument({
      familyFileId: PENSON_FAMILY_FILE_ID,
      beneficiaryId: PENSON_BENEFICIARY_ID,
      createdById: CREATED_BY_ID
    })

    const input: Input = { familyFileId: PENSON_FAMILY_FILE_ID }
    const result = await trpc.receptionAgent.file.getDocuments(input)
    expect(result.documents.find(d => d.document.key === key)).toBeUndefined()
  })

  test('should allow referent assigned to family file', async ({ trpc }) => {
    await createDocument({
      familyFileId: COURSOR_FAMILY_FILE_ID,
      beneficiaryId: COURSOR_BENEFICIARY_ID
    })

    const input: Input = { familyFileId: COURSOR_FAMILY_FILE_ID }
    const result = await trpc.referent.file.getDocuments(input)
    expect(result.documents.length).toBeGreaterThanOrEqual(1)
  })

  test('should reject referent not assigned to family file', async ({
    trpc
  }) => {
    const input: Input = { familyFileId: FAMILY_FILE_ID }
    await expect(trpc.referent.file.getDocuments(input)).rejects.toThrowError(
      /no record/i
    )
  })
})

describe('Response shape', () => {
  test('should return documents with permissions, count, and totalPages', async ({
    trpc
  }) => {
    await createDocument()

    const input: Input = { familyFileId: FAMILY_FILE_ID }
    const result = await trpc.structureManager.file.getDocuments(input)

    expect(result).toMatchObject({
      count: expect.any(Number),
      totalPages: expect.any(Number),
      documents: expect.any(Array)
    })
    expect(result.count).toBeGreaterThanOrEqual(1)
    expect(result.documents[0]).toMatchObject({
      document: expect.objectContaining({
        key: expect.any(String),
        name: expect.any(String),
        type: expect.any(String),
        mimeType: expect.any(String)
      }),
      permissions: expect.objectContaining({
        edit: expect.any(Boolean),
        delete: expect.any(Boolean)
      })
    })
  })
})

describe('Filters', () => {
  beforeEach(async () => {
    await createDocument({ type: 'Cerfa', tags: ['urgent'] })
    await createDocument({ type: 'Justificatifs', tags: ['archive'] })
  })

  test('should filter by document type', async ({ trpc }) => {
    const input: Input = {
      familyFileId: FAMILY_FILE_ID,
      filters: { type: 'Cerfa' }
    }
    const result = await trpc.structureManager.file.getDocuments(input)

    expect(result.documents.length).toBeGreaterThanOrEqual(1)
    for (const { document } of result.documents) {
      expect(document.type).toBe('Cerfa')
    }
  })

  test('should filter by tag', async ({ trpc }) => {
    const input: Input = {
      familyFileId: FAMILY_FILE_ID,
      filters: { tags: 'urgent' }
    }
    const result = await trpc.structureManager.file.getDocuments(input)

    expect(result.documents.length).toBeGreaterThanOrEqual(1)
    for (const { document } of result.documents) {
      expect(document.tags).toContain('urgent')
    }
  })

  test('should filter by beneficiaryId', async ({ trpc }) => {
    const input: Input = {
      familyFileId: FAMILY_FILE_ID,
      filters: { beneficiaryId: BENEFICIARY_ID }
    }
    const result = await trpc.structureManager.file.getDocuments(input)

    expect(result.documents.length).toBeGreaterThanOrEqual(1)
    for (const { document } of result.documents) {
      expect(document.beneficiaryId).toBe(BENEFICIARY_ID)
    }
  })
})

describe('Confidential documents', () => {
  test('should grant view permission to the creator', async ({ trpc }) => {
    const { key } = await createDocument({
      confidential: true,
      createdById: CREATED_BY_ID
    })

    const input: Input = { familyFileId: FAMILY_FILE_ID }
    const result = await trpc.structureManager.file.getDocuments(input)

    const doc = result.documents.find(d => d.document.key === key)
    expect(doc).toBeDefined()
    expect(doc!.permissions.view).toBe(true)
  })

  test('should deny view permission to a non-creator', async ({ trpc }) => {
    const { key } = await createDocument({
      confidential: true,
      createdById: SOCIAL_WORKER_ID
    })

    const input: Input = { familyFileId: FAMILY_FILE_ID }
    // ReceptionAgent and Referent cannot see the document
    const roles = ['structureManager', 'instructor'] as const
    const results = await Promise.all(
      roles.map(r => trpc[r].file.getDocuments(input))
    )

    results.forEach((res, index) => {
      expect(res.count).toBe(1)
      expect(res.documents[0]!.document.key).toBe(key)

      expect(res.documents[0]!.permissions).toEqual({
        edit: false,
        view: false,
        // Structure manager can delete a confidential document that she has not created
        delete: index === 0 ? true : false,
        set: {
          confidential: false
        }
      })
    })
  })
})

describe('Cross-structure isolation', () => {
  test('should not return documents from another structure family file', async ({
    trpc
  }) => {
    const input: Input = {
      familyFileId: OTHER_STRUCTURE_FAMILY_FILE_ID
    }
    await expect(
      trpc.structureManager.file.getDocuments(input)
    ).rejects.toThrowError(/no record/i)
  })
})
