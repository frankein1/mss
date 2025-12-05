import { S3Client } from '@aws-sdk/client-s3'

export function getS3Client() {
  const config = useRuntimeConfig()

  return new S3Client({
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.accessKeyId
    },
    region: config.s3.region,
    endpoint: config.s3.endpoint
  })
}
