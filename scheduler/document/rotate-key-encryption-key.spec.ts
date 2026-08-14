import { describe, it, expect, afterEach, vi } from 'vitest'
import { prismaClient } from '~~/server/prisma'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { DocumentType } from '@prisma/client'
import { rotateKeyEncryptionKey } from './rotate-key-encryption-key'

process.env.NUXT_DOCUMENT_ROTATE_KEK_BATCH_SIZE = '2'

vi.mock('~~/server/lib/encryption/kms')

const DOC_NAME_PREFIX = 'ROTATE-KEK-'

const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id
const familyFileId = fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id
const createdById = fixturesUsers[FixtureUserRole.StructureManager].id

function createDocument(overrides: {
  name: string
  encryptedDataKey?: string | null
  migrated?: boolean
}) {
  return prismaClient.document.create({
    data: {
      mimeType: 'application/pdf',
      filenameDisk: 'test.pdf',
      type: DocumentType.Justificatifs,
      confidential: false,
      migrated: true,
      beneficiaryId,
      familyFileId,
      createdById,
      encryptedDataKey: 'vault:v1:default-dek',
      ...overrides
    }
  })
}

afterEach(async () => {
  await prismaClient.document.deleteMany({
    where: { name: { startsWith: DOC_NAME_PREFIX } }
  })
})

describe('Rotate Key Encryption Key', () => {
  it('should not rewrap documents already on the latest version', async () => {
    await createDocument({
      name: `${DOC_NAME_PREFIX}up-to-date-1`,
      encryptedDataKey: 'vault:v2:dek-a'
    })
    await createDocument({
      name: `${DOC_NAME_PREFIX}up-to-date-2`,
      encryptedDataKey: 'vault:v2:dek-b'
    })
    await createDocument({
      name: `${DOC_NAME_PREFIX}up-to-date-3`,
      encryptedDataKey: 'vault:v2:dek-c'
    })

    await rotateKeyEncryptionKey()

    const docs = await prismaClient.document.findMany({
      where: { name: { startsWith: DOC_NAME_PREFIX } },
      // eslint-disable-next-line no-restricted-syntax -- test file
      select: { encryptedDataKey: true }
    })

    for (const doc of docs) {
      expect(doc.encryptedDataKey).not.toContain('_rewrapped')
    }
  })

  it('should rewrap all documents on an old version', async () => {
    const doc1 = await createDocument({
      name: `${DOC_NAME_PREFIX}old-1`,
      encryptedDataKey: 'vault:v1:dek-a'
    })
    const doc2 = await createDocument({
      name: `${DOC_NAME_PREFIX}old-2`,
      encryptedDataKey: 'vault:v1:dek-b'
    })
    const doc3 = await createDocument({
      name: `${DOC_NAME_PREFIX}old-3`,
      encryptedDataKey: 'vault:v1:dek-c'
    })

    await rotateKeyEncryptionKey()

    const updated = await prismaClient.document.findMany({
      where: { key: { in: [doc1.key, doc2.key, doc3.key] } },
      // eslint-disable-next-line no-restricted-syntax -- test file
      select: { key: true, encryptedDataKey: true }
    })

    for (const doc of updated) {
      expect(doc.encryptedDataKey).toMatch(/^vault:v2:.*_rewrapped$/)
    }
  })

  it('should only rewrap documents on an old version in a mixed set', async () => {
    const stale1 = await createDocument({
      name: `${DOC_NAME_PREFIX}stale-1`,
      encryptedDataKey: 'vault:v1:dek-old'
    })
    const current = await createDocument({
      name: `${DOC_NAME_PREFIX}current-1`,
      encryptedDataKey: 'vault:v2:dek-new'
    })
    const stale2 = await createDocument({
      name: `${DOC_NAME_PREFIX}stale-2`,
      encryptedDataKey: 'vault:v1:dek-old-2'
    })

    await rotateKeyEncryptionKey()

    const [updatedStale1, updatedCurrent, updatedStale2] = await Promise.all([
      prismaClient.document.findUniqueOrThrow({
        where: { key: stale1.key },
        // eslint-disable-next-line no-restricted-syntax -- test file
        select: { encryptedDataKey: true }
      }),
      prismaClient.document.findUniqueOrThrow({
        where: { key: current.key },
        // eslint-disable-next-line no-restricted-syntax -- test file
        select: { encryptedDataKey: true }
      }),
      prismaClient.document.findUniqueOrThrow({
        where: { key: stale2.key },
        // eslint-disable-next-line no-restricted-syntax -- test file
        select: { encryptedDataKey: true }
      })
    ])

    expect(updatedStale1.encryptedDataKey).toBe('vault:v2:dek-old_rewrapped')
    expect(updatedCurrent.encryptedDataKey).toBe('vault:v2:dek-new')
    expect(updatedStale2.encryptedDataKey).toBe('vault:v2:dek-old-2_rewrapped')
  })

  it('should throw when a document has null encryptedDataKey', async () => {
    await createDocument({
      name: `${DOC_NAME_PREFIX}no-dek`,
      encryptedDataKey: null,
      migrated: false
    })

    await expect(rotateKeyEncryptionKey()).rejects.toThrow(/missing data key/)
  })
})
