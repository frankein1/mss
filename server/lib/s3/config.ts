import { S3Client } from '@aws-sdk/client-s3'

let instance: S3Client | null = null

export function getS3Client() {
  if (instance) {
    return instance
  }

  const config = useRuntimeConfig()

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

let proxyInstance: S3Client | null = null

export function getDSProxyS3Client() {
  if (proxyInstance) {
    return proxyInstance
  }

  const config = useRuntimeConfig()

  proxyInstance = new S3Client({
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey
    },
    region: config.s3.region,
    endpoint: config.s3.encryptionProxyEndpoint,
    forcePathStyle: true
  })

  return proxyInstance
}
