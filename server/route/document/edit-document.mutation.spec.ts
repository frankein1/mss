import type { DocumentType } from '@prisma/client'
import type { inferProcedureInput } from '@trpc/server'
import { afterEach, describe, expect } from 'vitest'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesFamilyFiles,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'
import { test } from '~~/test/server/test-utils'
import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['documents']['edit']>

// TEARLE family file (Test structure) — referent: StructureManager only
const FAMILY_FILE_ID = fixturesFamilyFiles[FixtureBeneficiary.TEARLE].id
const BENEFICIARY_ID = fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id

// COURSOR family file (Test structure) — referents: StructureManager + Referent
const COURSOR_FAMILY_FILE_ID =
  fixturesFamilyFiles[FixtureBeneficiary.COURSOR].id
const COURSOR_BENEFICIARY_ID =
  fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id

const MANAGER_ID = fixturesUsers[FixtureUserRole.StructureManager].id
const SOCIAL_WORKER_ID = fixturesUsers[FixtureUserRole.SocialWorker].id
const RECEPTION_AGENT_ID = fixturesUsers[FixtureUserRole.ReceptionAgent].id

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
      name: overrides.name ?? 'UDT-original-name.pdf',
      mimeType: 'application/pdf',
      filenameDisk: `disk-${crypto.randomUUID()}`,
      type: overrides.type ?? 'Justificatifs',
      tags: overrides.tags ?? [],
      confidential: overrides.confidential ?? false,
      familyFileId: overrides.familyFileId ?? FAMILY_FILE_ID,
      beneficiaryId: overrides.beneficiaryId ?? BENEFICIARY_ID,
      createdById: overrides.createdById ?? MANAGER_ID
    }
  })
  createdDocumentKeys.push(doc.key)
  return doc
}

// Compulsory fields for an edit
const baseEditInput = (
  key: string,
  beneficiaryId: string = BENEFICIARY_ID
): Input => ({
  key,
  beneficiaryId,
  name: 'UDT-updated-name.pdf',
  type: 'Rapports',
  tags: ['UDT-tag'],
  confidential: false
})

afterEach(async () => {
  if (createdDocumentKeys.length > 0) {
    await prismaClient.document.deleteMany({
      where: { key: { in: createdDocumentKeys } }
    })
    createdDocumentKeys.length = 0
  }
})

describe('Document - Edit - Authorizations', () => {
  test('A manager can edit a document', async ({ trpc }) => {
    const { key } = await createDocument()

    const result = await trpc.structureManager.documents.edit(
      baseEditInput(key)
    )

    expect(result.key).toBe(key)
  })

  test('A social worker can edit a non-confidential document', async ({
    trpc
  }) => {
    const { key } = await createDocument()

    const result = await trpc.socialWorker.documents.edit(baseEditInput(key))

    expect(result.key).toBe(key)
  })

  test('An instructor can edit a non-confidential document', async ({
    trpc
  }) => {
    const { key } = await createDocument()

    const result = await trpc.instructor.documents.edit(baseEditInput(key))

    expect(result.key).toBe(key)
  })

  test('A referent assigned to the family file can edit a document', async ({
    trpc
  }) => {
    const { key } = await createDocument({
      familyFileId: COURSOR_FAMILY_FILE_ID,
      beneficiaryId: COURSOR_BENEFICIARY_ID
    })

    const result = await trpc.referent.documents.edit(
      baseEditInput(key, COURSOR_BENEFICIARY_ID)
    )

    expect(result.key).toBe(key)
  })

  test('A referent not assigned to the family file cannot edit a document', async ({
    trpc
  }) => {
    // TEARLE has only StructureManager as referent, so the constraint layer
    // filters the document out before securityCheck runs
    const { key } = await createDocument()

    await expect(() =>
      trpc.referent.documents.edit(baseEditInput(key))
    ).rejects.toThrow(/document[\s\S]*?no record/im)
  })

  test('A reception agent cannot edit a document they did not create', async ({
    trpc
  }) => {
    // The constraint layer scopes a reception agent to documents they created,
    // so an unowned document is not found before securityCheck runs
    const { key } = await createDocument({ createdById: MANAGER_ID })

    await expect(() =>
      trpc.receptionAgent.documents.edit(baseEditInput(key))
    ).rejects.toThrow(/document[\s\S]*?no record/im)
  })

  test('A reception agent can edit a document they created', async ({
    trpc
  }) => {
    const { key } = await createDocument({ createdById: RECEPTION_AGENT_ID })

    const result = await trpc.receptionAgent.documents.edit(baseEditInput(key))

    expect(result.key).toBe(key)
  })

  test('An administrator cannot edit a document', async ({ trpc }) => {
    const { key } = await createDocument()

    await expect(() =>
      trpc.administrator.documents.edit(baseEditInput(key))
    ).rejects.toThrow(/user routes are not available to admins/i)
  })

  test('A manager from another structure cannot edit a document', async ({
    trpc
  }) => {
    const { key } = await createDocument()

    await expect(() =>
      trpc.structureManagerMinistere.documents.edit(baseEditInput(key))
    ).rejects.toThrow(/document[\s\S]*?no record/im)
  })
})

describe('Document - Edit - Confidentiality', () => {
  test('The creator can set a document as confidential', async ({ trpc }) => {
    const { key } = await createDocument({
      createdById: MANAGER_ID,
      confidential: false
    })

    await trpc.structureManager.documents.edit({
      ...baseEditInput(key),
      confidential: true
    })

    const record = await prismaClient.document.findUniqueOrThrow({
      where: { key },
      select: { confidential: true }
    })
    expect(record.confidential).toBe(true)
  })

  test('A non-creator cannot change the confidentiality of a document', async ({
    trpc
  }) => {
    // Created by the social worker, edited by the manager (a non-creator)
    const { key } = await createDocument({
      createdById: SOCIAL_WORKER_ID,
      confidential: false
    })

    await expect(() =>
      trpc.structureManager.documents.edit({
        ...baseEditInput(key),
        confidential: true
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A non-creator can edit other fields without changing confidentiality', async ({
    trpc
  }) => {
    const { key } = await createDocument({
      createdById: SOCIAL_WORKER_ID,
      confidential: false
    })

    const result = await trpc.structureManager.documents.edit({
      ...baseEditInput(key),
      confidential: false
    })

    expect(result.key).toBe(key)
  })

  test('A non-creator cannot edit a confidential document', async ({
    trpc
  }) => {
    const { key } = await createDocument({
      createdById: SOCIAL_WORKER_ID,
      confidential: true
    })

    await expect(() =>
      trpc.structureManager.documents.edit({
        ...baseEditInput(key),
        confidential: true
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Document - Edit - Field updates', () => {
  test('The editable fields are persisted', async ({ trpc }) => {
    const { key } = await createDocument({
      name: 'UDT-before.pdf',
      type: 'Justificatifs',
      tags: []
    })

    const expirationDate = new Date('2027-01-15')

    await trpc.structureManager.documents.edit({
      ...baseEditInput(key),
      name: 'UDT-after.pdf',
      type: 'Cerfa',
      tags: ['UDT-a', 'UDT-b'],
      expirationDate
    })

    const record = await prismaClient.document.findUniqueOrThrow({
      where: { key },
      select: {
        name: true,
        type: true,
        tags: true,
        expirationDate: true
      }
    })

    expect(record).toStrictEqual({
      name: 'UDT-after.pdf',
      type: 'Cerfa',
      tags: ['UDT-a', 'UDT-b'],
      expirationDate
    })
  })
})

describe('Document - Edit - Response shape', () => {
  test('The mutation returns the document DTO', async ({ trpc }) => {
    const { key } = await createDocument({ createdById: MANAGER_ID })

    const result = await trpc.structureManager.documents.edit({
      ...baseEditInput(key),
      name: 'UDT-dto.pdf',
      type: 'Rapports',
      tags: ['UDT-tag']
    })

    expect(result).toStrictEqual({
      key,
      created: expect.any(Date),
      confidential: false,
      beneficiaryId: BENEFICIARY_ID,
      createdById: MANAGER_ID,
      createdBy: {
        firstName: fixturesUsers[FixtureUserRole.StructureManager].firstName,
        lastName: fixturesUsers[FixtureUserRole.StructureManager].lastName
      },
      name: 'UDT-dto.pdf',
      type: 'Rapports',
      tags: ['UDT-tag'],
      expirationDate: null,
      mimeType: 'application/pdf',
      _count: {
        notifications: 0
      }
    })
  })
})
