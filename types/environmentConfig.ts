export type EnvironmentConfig = {
  document: {
    useS3Storage: boolean
    encryptionVersion: string
    encryptionAlgorithm: string
  }
  s3: {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
    endpoint: string
  }
  kms: {
    accessKeyId: string
    secretKey: string
    organizationId: string
    projectId: string
    region: string
    apiUrl: string
    keyId: string
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpSecure: boolean
    smtpUser: string
    smtpPassword: string
  }
  public: {
    mssEnvironment: string
    email: {
      from: string
    }
    sentry: {
      dsn: string | undefined
      debug: boolean
      tracesSampleRate: number
    }
    landingPageUrl: string
  }
}
