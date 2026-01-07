/** Signed URL generation for S3 bucket
 * If an encryption proxy is setup, a step of url domain replacement by the proxy url
 * is integrated
 */
import {
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'

const replaceUrlIfEncryptionActivated = (
  config: RuntimeConfig['s3'],
  url: string
) => {
  if (!config.useEncryptionProxy) {
    return url
  }

  const replaced = new URL(url)

  replaced.host = new URL(config.encryptionProxyEndpoint).host
  replaced.protocol = new URL(config.encryptionProxyEndpoint).protocol
  replaced.pathname = `/upstream${replaced.pathname}`

  return replaced.toString()
}

export async function getPresignedUrlForUpload(
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

  const url = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds
  })

  console.log(url)

  return replaceUrlIfEncryptionActivated(runtimeConfig, url)
}

export async function getSignedUrlForRead(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  nBytes = 100,
  expiresInSeconds = 60
) {
  const client = getS3Client()

  const command = new GetObjectCommand({
    Bucket: runtimeConfig.bucket,
    Key: key,
    Range: `bytes=0-${nBytes}`
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds
  })

  return replaceUrlIfEncryptionActivated(runtimeConfig, url)
}

export async function getSignedUrlForHead(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  expiresInSeconds = 60
) {
  const client = getS3Client()

  const command = new HeadObjectCommand({
    Bucket: runtimeConfig.bucket,
    Key: key
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds
  })

  return replaceUrlIfEncryptionActivated(runtimeConfig, url)
}
