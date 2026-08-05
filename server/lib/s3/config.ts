import { S3Client } from '@aws-sdk/client-s3'
import type { AppConfig } from '~/types/appConfig'

let instance: S3Client | null = null

export function getS3Client(
  config: Pick<AppConfig, 's3'> & { public: { mssEnvironment: string } }
) {
  if (instance) {
    return instance
  }

  instance = new S3Client({
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey
    },
    region: config.s3.region,
    endpoint: config.s3.endpoint,
    forcePathStyle: config.s3.forcePathStyle,
    retryMode: 'standard',
    maxAttempts: 5
  })

  return instance
}
