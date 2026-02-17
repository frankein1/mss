import { S3Client } from '@aws-sdk/client-s3'
import type { RuntimeConfig } from 'nuxt/schema'

let instance: S3Client | null = null

export function getS3Client(config: Pick<RuntimeConfig, 's3'>) {
  if (instance) {
    return instance
  }

  instance = new S3Client({
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey
    },
    region: config.s3.region,
    endpoint: config.s3.endpoint
  })

  return instance
}
