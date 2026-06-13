import {
  DeleteObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getS3Client } from './config'
import { encrypt } from '~/server/lib/encryption/encrypt'
import type { DataForEncryptionContext } from '~/server/lib/encryption/helper'
import { decrypt } from '~/server/lib/encryption/decrypt'
import type { AppConfig } from '~/types/appConfig'

export async function deleteFile(
  config: Pick<AppConfig, 'document' | 's3' | 'public'>,
  key: string
) {
  const client = getS3Client(config)

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.s3.bucket,
      Key: key
    })
  )

  return key
}

const S3_DELETE_BATCH_SIZE = 1000

export async function deleteFilesByKeys(
  config: Pick<AppConfig, 'document' | 's3' | 'public'>,
  keys: string[]
) {
  if (keys.length === 0) {
    return
  }

  const client = getS3Client(config)

  for (let i = 0; i < keys.length; i += S3_DELETE_BATCH_SIZE) {
    const batch = keys.slice(i, i + S3_DELETE_BATCH_SIZE)
    await client.send(
      new DeleteObjectsCommand({
        Bucket: config.s3.bucket,
        Delete: {
          Objects: batch.map(key => ({ Key: key }))
        }
      })
    )
  }
}

interface S3MetadataV2 {
  'encrypted': string
  'encryption-version': string
  'iv': string
}

interface UploadWithEncryptionInput {
  config: Pick<AppConfig, 'document' | 's3' | 'kms' | 'public'>
  bucketKey: string
  plainData: Buffer
  dataForEncryptionContext: DataForEncryptionContext
}
export async function uploadWithEncryption({
  config,
  bucketKey,
  plainData,
  dataForEncryptionContext
}: UploadWithEncryptionInput) {
  const client = getS3Client(config)

  const { encryptedContent, encryptedDataKey, ivBase64 } = await encrypt(
    config,
    plainData,
    dataForEncryptionContext
  )

  const s3Metadata = {
    'encrypted': 'true',
    'encryption-version': config.document.encryptionVersion,
    'iv': ivBase64
  } satisfies S3MetadataV2

  const upload = new Upload({
    client,
    params: {
      Bucket: config.s3.bucket,
      Body: Buffer.from(encryptedContent),
      Key: bucketKey,
      ContentType: 'application/octet-stream',
      Metadata: s3Metadata
    }
  })

  const res = await upload.done()

  return { key: res.Key, encryptedDataKey, metadata: s3Metadata }
}

interface DownloadWithEncryptionInput {
  config: Pick<AppConfig, 'document' | 's3' | 'kms' | 'public'>
  bucketKey: string
  dataForEncryptionContext: DataForEncryptionContext
  encryptedDataKey?: string | null
}
export async function downloadWithEncryption({
  config,
  bucketKey,
  dataForEncryptionContext,
  encryptedDataKey: dbEncryptedDataKey
}: DownloadWithEncryptionInput) {
  const client = getS3Client(config)

  const download = await client.send(
    new GetObjectCommand({
      Bucket: config.s3.bucket,
      Key: bucketKey
    })
  )

  if (!download.Body) {
    return { success: false, reason: 'missing file data' } as const
  }

  if (!download.Metadata) {
    return { success: false, reason: 'missing file metadata' } as const
  }

  const encryptionVersion = download.Metadata['encryption-version']
  if (!encryptionVersion) {
    return { success: false, reason: 'missing encryption version' } as const
  }

  const iv = download.Metadata['iv']
  if (!iv) {
    return { success: false, reason: 'missing iv' } as const
  }

  const encryptedDataKey = resolveEncryptedDataKey(
    encryptionVersion,
    dbEncryptedDataKey,
    download.Metadata
  )
  if (!encryptedDataKey) {
    return { success: false, reason: 'missing DEK' } as const
  }

  const encryptedContent = await download.Body.transformToByteArray()

  const { fileContent } = await decrypt(
    config,
    encryptedContent,
    encryptedDataKey,
    iv,
    {
      encryptionVersion,
      // TODO: remove v1 fields after local dev migration
      encryptionAlgorithm: download.Metadata['encryption-algorithm'],
      kmsKeyId: download.Metadata['kms-key-id']
    },
    dataForEncryptionContext
  )

  return { success: true, fileContent } as const
}

function resolveEncryptedDataKey(
  encryptionVersion: string,
  dbEncryptedDataKey: string | null | undefined,
  s3Metadata: Record<string, string>
): string | undefined {
  if (encryptionVersion === '2') {
    return dbEncryptedDataKey ?? undefined
  }

  // TODO: remove v1 fallback after local dev migration
  return s3Metadata['encrypted-data-key']
}
