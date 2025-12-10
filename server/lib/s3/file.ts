import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'

export async function upload(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  data: Buffer,
  contentType: string
) {
  const client = getS3Client()

  const command = new PutObjectCommand({
    Bucket: runtimeConfig.bucket,
    Body: data,
    Key: key,
    ContentType: contentType
  })

  await client.send(command)

  return key
}

export async function deleteFile(
  runtimeConfig: RuntimeConfig['s3'],
  key: string
) {
  const client = getS3Client()

  await client.send(
    new DeleteObjectCommand({
      Bucket: runtimeConfig.bucket,
      Key: key
    })
  )

  return key
}
