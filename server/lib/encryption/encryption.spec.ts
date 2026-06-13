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
    encryptionVersion: '2',
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
  const { encryptedContent, encryptedDataKey, ivBase64 } =
    await encrypt(CONFIG, plain, ENCRYPTION_CONTEXT)

  const metadata = {
    encryptionVersion: '2'
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

describe('Encryption - Algorithm execution', () => {
  test('Encryption - Round trip - returns original content', async () => {
    const original = Buffer.from('plain content to encrypt')
    const { fileContent } = await encryptAndDecrypt(original)
    expect(Buffer.from(fileContent)).toEqual(original)
  })

  test('Encryption - Tampered ciphertext - fails to decrypt', async () => {
    const { encryptedContent, encryptedDataKey, ivBase64 } =
      await encrypt(CONFIG, Buffer.from('content'), ENCRYPTION_CONTEXT)

    const tampered = Buffer.from(encryptedContent)
    tampered[0]! ^= 0xff

    await expect(
      decrypt(
        CONFIG,
        tampered,
        encryptedDataKey,
        ivBase64,
        { encryptionVersion: '2' },
        ENCRYPTION_CONTEXT
      )
    ).rejects.toThrow(/failed for an operation-specific reason/i)
  })

  test('Encryption - Wrong IV - fails to decrypt', async () => {
    const { encryptedContent, encryptedDataKey } = await encrypt(
      CONFIG,
      Buffer.from('content'),
      ENCRYPTION_CONTEXT
    )
    const wrongIv = randomBytes(12).toString('base64')

    await expect(
      decrypt(
        CONFIG,
        Buffer.from(encryptedContent),
        encryptedDataKey,
        wrongIv,
        { encryptionVersion: '2' },
        ENCRYPTION_CONTEXT
      )
    ).rejects.toThrow(/failed for an operation-specific reason/i)
  })
})

describe('Encryption - AAD validation', () => {
  test('Encryption - AAD - fails when documentKey differs', async () => {
    await expect(
      encryptAndDecrypt(Buffer.from('content'), {
        ...ENCRYPTION_CONTEXT,
        documentKey: 'other-uuid'
      })
    ).rejects.toThrow()
  })

  test('Encryption - AAD - does not bind contentLength', async () => {
    const { fileContent } = await encryptAndDecrypt(Buffer.from('content'), {
      ...ENCRYPTION_CONTEXT,
      contentLength: 9999
    })
    expect(Buffer.from(fileContent)).toEqual(Buffer.from('content'))
  })

  test('Encryption - AAD - does not bind contentType', async () => {
    const { fileContent } = await encryptAndDecrypt(Buffer.from('content'), {
      ...ENCRYPTION_CONTEXT,
      contentType: 'image/png'
    })
    expect(Buffer.from(fileContent)).toEqual(Buffer.from('content'))
  })
})
