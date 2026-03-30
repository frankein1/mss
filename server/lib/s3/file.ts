import {
  DeleteObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command
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

/** Delete all S3 objects under a given prefix (simulates folder deletion).
 *  Handles pagination for prefixes with >1000 objects.
 */
export async function deleteAllFilesWithPrefix(
  config: Pick<AppConfig, 'document' | 's3' | 'public'>,
  prefix: string
) {
  const client = getS3Client(config)
  let continuationToken: string | undefined

  do {
    const listed = await client.send(
      new ListObjectsV2Command({
        Bucket: config.s3.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken
      })
    )

    if (listed.Contents?.length) {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: config.s3.bucket,
          Delete: {
            Objects: listed.Contents.map(obj => ({ Key: obj.Key }))
          }
        })
      )
    }

    continuationToken = listed.IsTruncated
      ? listed.NextContinuationToken
      : undefined
  } while (continuationToken)
}

interface S3Metadata {
  'encrypted': string
  'encryption-version': string
  'encryption-algorithm': string
  'kms-key-id': string
  'encrypted-data-key': string
  'iv': string
}
interface UploadWithEncryptionInput {
  config: Pick<AppConfig, 'document' | 's3' | 'kms' | 'public'> & {
    public: { mssEnvironment: string }
  }
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

  const { encryptedContent, encryptedDataKey, ivBase64, kmsKeyId } =
    await encrypt(config, plainData, dataForEncryptionContext)

  // Encrypted DEK and iv are stored in S3 metadata
  // The other metadata variables are used to regenerate the Associated Authenticated Data
  const s3Metadata = {
    'encrypted': 'true',
    'encryption-version': config.document.encryptionVersion,
    'encryption-algorithm': config.document.encryptionAlgorithm,
    'kms-key-id': kmsKeyId,
    'encrypted-data-key': encryptedDataKey,
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

  return { key: res.Key, metadata: s3Metadata }
}

interface DownloadWithEncryptionInput {
  config: Pick<AppConfig, 'document' | 's3' | 'kms' | 'public'>
  bucketKey: string
  dataForEncryptionContext: DataForEncryptionContext
}
export async function downloadWithEncryption({
  config,
  bucketKey,
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

  const encryptedDataKey = download.Metadata['encrypted-data-key']
  if (!encryptedDataKey) {
    return { success: false, reason: 'missing DEK' } as const
  }

  const iv = download.Metadata['iv']
  if (!iv) {
    return { success: false, reason: 'missing iv' } as const
  }

  if (
    !download.Metadata['encryption-version'] ||
    !download.Metadata['encryption-algorithm'] ||
    !download.Metadata['kms-key-id']
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
      encryptionAlgorithm: download.Metadata['encryption-algorithm'],
      kmsKeyId: download.Metadata['kms-key-id']
    },
    dataForEncryptionContext
  )

  return { success: true, fileContent } as const
}
