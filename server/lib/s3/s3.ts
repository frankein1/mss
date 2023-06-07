import { S3Client } from '@aws-sdk/client-s3'

const config = useRuntimeConfig()

export const s3 = new S3Client({
  credentials: {
    accessKeyId: config.s3.key,
    secretAccessKey: config.s3.secret
  },
  region: config.s3.region,
  endpoint: `https://${config.s3.host}`
})
