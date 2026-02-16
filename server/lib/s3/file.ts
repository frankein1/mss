import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'
import { encrypt } from '../encryption/encrypt'
import type { DataForEncryptionContext } from '../encryption/helper'
import { decrypt } from '../encryption/decrypt'

export async function deleteFile(
  config: Pick<RuntimeConfig, 'document' | 's3'>,
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

interface S3Metadata {
  'x-amz-meta-encrypted': string
  'x-amz-meta-encryption-version': string
  'x-amz-meta-encryption-algorithm': string
  'x-amz-meta-kms-key-id': string
  'x-amz-meta-encrypted-data-key': string
  'x-amz-meta-iv': string
}
interface UploadWithEncryptionInput {
  config: Pick<RuntimeConfig, 'document' | 's3' | 'kms'>
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
    'x-amz-meta-encrypted': 'true',
    'x-amz-meta-encryption-version': config.document.encryptionVersion,
    'x-amz-meta-encryption-algorithm': config.document.encryptionAlgorithm,
    'x-amz-meta-kms-key-id': kmsKeyId,
    'x-amz-meta-encrypted-data-key': encryptedDataKey,
    'x-amz-meta-iv': ivBase64
  } satisfies S3Metadata

  const upload = new Upload({
    client,
    params: {
      Bucket: config.s3.bucket,
      Body: Buffer.from(encryptedContent),
      Key: bucketKey,
      ContentType: dataForEncryptionContext.contentType,
      Metadata: s3Metadata
    }
  })

  const res = await upload.done()

  return { key: res.Key, metadata: s3Metadata }
}

interface DownloadWithEncryptionInput {
  config: Pick<RuntimeConfig, 'document' | 's3'>
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

  const encryptedDataKey = download.Metadata['x-amz-meta-encrypted-data-key']
  if (!encryptedDataKey) {
    return { success: false, reason: 'missing DEK' } as const
  }

  const iv = download.Metadata['x-amz-meta-iv']
  if (!iv) {
    return { success: false, reason: 'missing iv' } as const
  }

  if (
    !download.Metadata['x-amz-meta-encryption-version'] ||
    !download.Metadata['x-amz-meta-encryption-algorithm'] ||
    !download.Metadata['x-amz-meta-kms-key-id']
  ) {
    return { success: false, reason: 'missing metadata content' } as const
  }

  const encryptedContent = await download.Body.transformToByteArray()

  const { fileContent } = await decrypt(
    Buffer.from(encryptedContent),
    encryptedDataKey,
    iv,
    {
      encryptionVersion: download.Metadata['x-amz-meta-encryption-version'],
      encryptionAlgorithm: download.Metadata['x-amz-meta-encryption-algorithm'],
      kmsKeyId: download.Metadata['x-amz-meta-kms-key-id']
    },
    dataForEncryptionContext
  )

  return { success: true, fileContent } as const
}
