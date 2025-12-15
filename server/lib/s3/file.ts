import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'

export async function upload(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  data: Buffer,
  contentType: string
) {
  const client = getS3Client()

  const upload = new Upload({
    client,
    params: {
      Bucket: runtimeConfig.bucket,
      Body: data,
      Key: key,
      ContentType: contentType
    }
  })

  const res = await upload.done()

  return res.Key
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
