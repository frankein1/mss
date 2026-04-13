import { S3Client } from '@aws-sdk/client-s3'
import type { EnvironmentConfig } from '~/types/environmentConfig'

let instance: S3Client | null = null

export function getS3Client(config: Pick<EnvironmentConfig, 's3' | 'public'>) {
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
    forcePathStyle: config.public.mssEnvironment === 'local' // for compatibility with rustfs
  })

  return instance
}
