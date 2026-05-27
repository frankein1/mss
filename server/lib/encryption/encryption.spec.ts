import { describe, test, expect } from 'vitest'
import { encrypt } from './encrypt'
import { decrypt } from './decrypt'
import { randomBytes } from 'node:crypto'

const CONFIG = {
  kms: {
    keyId: 'test-key-id',
    accessKeyId: '',
    secretKey: '',
    projectId: '',
    region: '',
    apiUrl: '',
    organizationId: ''
  },
  document: {
    useS3Storage: true,
    encryptionVersion: '1',
    encryptionAlgorithm: 'aes_256_gcm'
  }
}

const ENCRYPTION_CONTEXT = {
  documentKey: 'doc-uuid',
  contentType: 'application/pdf',
  contentLength: 1234
}

async function encryptAndDecrypt(
  plain: Buffer,
  decryptContext = ENCRYPTION_CONTEXT
) {
  const { encryptedContent, encryptedDataKey, ivBase64, kmsKeyId } =
    await encrypt(CONFIG, plain, ENCRYPTION_CONTEXT)

  const metadata = {
    encryptionVersion: '1',
    encryptionAlgorithm: 'aes_256_gcm',
    kmsKeyId
  }

  return decrypt(
    CONFIG,
    Buffer.from(encryptedContent),
    encryptedDataKey,
    ivBase64,
    metadata,
    decryptContext
  )
}

describe('encryption - Algorithm execution', () => {
  test('succeed: round-trip returns original content', async () => {
    const original = Buffer.from('plain content to encrypt')
    const { fileContent } = await encryptAndDecrypt(original)
    expect(Buffer.from(fileContent)).toEqual(original)
  })

  test('fails when ciphertext is tampered', async () => {
    const { encryptedContent, encryptedDataKey, ivBase64, kmsKeyId } =
      await encrypt(CONFIG, Buffer.from('content'), ENCRYPTION_CONTEXT)

    const tampered = Buffer.from(encryptedContent)
    tampered[0]! ^= 0xff
    const metadata = {
      encryptionVersion: '1',
      encryptionAlgorithm: 'aes_256_gcm',
      kmsKeyId
    }

    await expect(
      decrypt(
        CONFIG,
        tampered,
        encryptedDataKey,
        ivBase64,
        metadata,
        ENCRYPTION_CONTEXT
      )
    ).rejects.toThrow(/failed for an operation-specific reason/i)
  })

  test('fails when IV is wrong', async () => {
    const { encryptedContent, encryptedDataKey, kmsKeyId } = await encrypt(
      CONFIG,
      Buffer.from('content'),
      ENCRYPTION_CONTEXT
    )
    const wrongIv = randomBytes(12).toString('base64')
    const metadata = {
      encryptionVersion: '1',
      encryptionAlgorithm: 'aes_256_gcm',
      kmsKeyId
    }

    await expect(
      decrypt(
        CONFIG,
        Buffer.from(encryptedContent),
        encryptedDataKey,
        wrongIv,
        metadata,
        ENCRYPTION_CONTEXT
      )
    ).rejects.toThrow(/failed for an operation-specific reason/i)
  })
})

describe('encryption - Encryption Context validation', () => {
  test('fails when documentKey differs', async () => {
    await expect(
      encryptAndDecrypt(Buffer.from('content'), {
        ...ENCRYPTION_CONTEXT,
        documentKey: 'other-uuid'
      })
    ).rejects.toThrow()
  })

  test('fails when contentLength differs', async () => {
    await expect(
      encryptAndDecrypt(Buffer.from('content'), {
        ...ENCRYPTION_CONTEXT,
        contentLength: 1489
      })
    ).rejects.toThrow(/failed for an operation-specific reason/i)
  })

  test('fails when contentType differs', async () => {
    await expect(
      encryptAndDecrypt(Buffer.from('content'), {
        ...ENCRYPTION_CONTEXT,
        contentType: 'image/png'
      })
    ).rejects.toThrow(/failed for an operation-specific reason/i)
  })
})
