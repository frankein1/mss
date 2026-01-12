/** Signed URL generation for S3 bucket
 * If an encryption proxy is setup, a step of url domain replacement by the proxy url
 * is integrated
 */
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getDSProxyS3Client, getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'

const getProxyClient = (config: RuntimeConfig['s3']) =>
  config.useEncryptionProxy ? getDSProxyS3Client() : getS3Client()

const getProxyBucket = (config: RuntimeConfig['s3']) =>
  config.useEncryptionProxy ? 'upstream' : config.bucket

export async function getPresignedUrlForUpload(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  contentType: string,
  contentLength: number,
  expiresInSeconds = 60
) {
  console.log(
    'runtimeConfig.useEncryptionProxy',
    runtimeConfig.useEncryptionProxy
  )

  const client = getProxyClient(runtimeConfig)
  const Bucket = getProxyBucket(runtimeConfig)

  const command = new PutObjectCommand({ Bucket, Key: key })

  const url = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds
  })

  console.log('url produced by aws sdk for upload', url)

  return url
}

export async function getSignedUrlForRead(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  expiresInSeconds = 60,
  nFirstBytes: number | undefined = undefined
) {
  const client = getProxyClient(runtimeConfig)
  const Bucket = getProxyBucket(runtimeConfig)

  const command = new GetObjectCommand({
    Bucket,
    Key: key,
    ...(nFirstBytes !== undefined && { Range: `bytes=0-${nFirstBytes}` })
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds
  })

  return url
}
