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

const S3_DELETE_BATCH_SIZE = 1000

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

export async function deleteFiles(
  config: Pick<AppConfig, 'document' | 's3' | 'public'>,
  keys: string[]
) {
  if (!keys.length) {
    return
  }

  const client = getS3Client(config)

  for (let i = 0; i < keys.length; i += S3_DELETE_BATCH_SIZE) {
    const batchKeys = keys.slice(i, i + S3_DELETE_BATCH_SIZE)
    const response = await client.send(
      new DeleteObjectsCommand({
        Bucket: config.s3.bucket,
        Delete: {
          Objects: batchKeys.map(key => ({ Key: key }))
        }
      })
    )

    if (response.Errors?.length) {
      console.error(`file: S3 deleteFiles ${response.Errors?.length} errors`)
      for (const error of response.Errors.slice(0, 50)) {
        console.error(
          `file: S3 deleteFiles partial failure: key=${error.Key} code=${error.Code} message=${error.Message}`
        )
      }
    }
  }
}

interface S3Metadata {
  'encrypted': string
  'encryption-version': string
  'encryption-algorithm': string
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

  // iv is stored in S3 metadata for decryption
  // The other metadata variables are used to regenerate the Associated Authenticated Data
  const s3Metadata = {
    'encrypted': 'true',
    'encryption-version': config.document.encryptionVersion,
    'encryption-algorithm': config.document.encryptionAlgorithm,
    'iv': ivBase64
  } satisfies S3Metadata

  const upload = new Upload({
    client,
    params: {
      Bucket: config.s3.bucket,
      Body: Buffer.from(encryptedContent),
      Key: bucketKey,
      ContentType: 'application/octet-stream', // default content-type
      Metadata: s3Metadata
    }
  })

  const res = await upload.done()

  return { key: res.Key, encryptedDataKey, metadata: s3Metadata }
}

interface DownloadWithEncryptionInput {
  config: Pick<AppConfig, 'document' | 's3' | 'kms' | 'public'>
  bucketKey: string
  encryptedDataKey: string
  dataForEncryptionContext: DataForEncryptionContext
}
export async function downloadWithEncryption({
  config,
  bucketKey,
  encryptedDataKey,
  dataForEncryptionContext
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

  const iv = download.Metadata['iv']
  if (!iv) {
    return { success: false, reason: 'missing iv' } as const
  }

  if (
    !download.Metadata['encryption-version'] ||
    !download.Metadata['encryption-algorithm']
  ) {
    return { success: false, reason: 'missing metadata content' } as const
  }

  const encryptedContent = await download.Body.transformToByteArray()

  const { fileContent } = await decrypt(
    config,
    encryptedContent,
    encryptedDataKey,
    iv,
    {
      encryptionVersion: download.Metadata['encryption-version'],
      encryptionAlgorithm: download.Metadata['encryption-algorithm']
    },
    dataForEncryptionContext
  )

  return { success: true, fileContent } as const
}
