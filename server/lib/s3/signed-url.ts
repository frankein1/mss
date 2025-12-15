import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'

export function getPresignedUrlForUpload(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  contentType: string,
  contentLength: number,
  expiresInSeconds = 60
) {
  const client = getS3Client()

  const command = new PutObjectCommand({
    Bucket: runtimeConfig.bucket,
    Key: key
    // ContentLength: contentLength,
    // ContentType: contentType
  })

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

export function getSignedUrlForRead(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  expiresInSeconds = 60
) {
  const client = getS3Client()

  const command = new GetObjectCommand({
    Bucket: runtimeConfig.bucket,
    Key: key
  })

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}
