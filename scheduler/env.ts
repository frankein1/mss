export const SCHEDULER_ENV = {
  document: {
    useS3Storage:
      (process.env.NUXT_DOCUMENT_USE_S3_STORAGE || 'false') === 'true',
    encryptionVersion: '1',
    encryptionAlgorithm: 'aes_256_gcm'
  },
  s3: {
    accessKeyId: process.env.NUXT_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NUXT_S3_SECRET_ACCESS_KEY || '',
    region: process.env.NUXT_S3_REGION || '',
    bucket: process.env.NUXT_S3_BUCKET || '',
    endpoint: process.env.NUXT_S3_ENDPOINT || '',
    forcePathStyle: (process.env.NUXT_S3_FORCE_PATH_STYLE || 'false') === 'true'
  },
  kms: {
    accessKeyId: process.env.NUXT_KMS_ACCESS_KEY_ID || '',
    secretKey: process.env.NUXT_KMS_SECRET_KEY || '',
    organizationId: process.env.NUXT_KMS_ORGANIZATION_ID || '',
    projectId: process.env.NUXT_KMS_PROJECT_ID || '',
    region: process.env.NUXT_KMS_REGION || '',
    apiUrl: process.env.NUXT_KMS_API_URL || '',
    keyId: process.env.NUXT_KMS_KEY_ID || ''
  },
  email: {
    smtpHost: process.env.NUXT_EMAIL_SMTP_HOST || '',
    smtpPort: parseInt(process.env.NUXT_EMAIL_SMTP_PORT || '587'),
    smtpSecure: (process.env.NUXT_EMAIL_SMTP_SECURE || 'false') === 'true',
    smtpUser: process.env.NUXT_EMAIL_SMTP_USER || '',
    smtpPassword: process.env.NUXT_EMAIL_SMTP_PASSWORD || ''
  },
  anonymizer: {
    readonlyDatabaseUrl: process.env.NUXT_READONLY_DATABASE_URL,
    anonymizedDatabaseUrl: process.env.NUXT_ANONYMIZED_DATABASE_URL
  },
  dataInclusion: {
    apiUrl: process.env.NUXT_DATA_INCLUSION_API_URL || '',
    apiToken: process.env.NUXT_DATA_INCLUSION_API_TOKEN || ''
  },
  public: {
    mssEnvironment: process.env.NUXT_PUBLIC_MSS_ENVIRONMENT || 'local',
    appUrl: process.env.NUXT_PUBLIC_APP_URL || '',
    email: {
      from: process.env.NUXT_PUBLIC_EMAIL_FROM || ''
    },
    sentry: {
      dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
      debug: (process.env.SENTRY_DEBUG || 'false') === 'true',
      tracesSampleRate: parseFloat(
        process.env.NUXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE || '0.1'
      )
    },
    landingPageUrl:
      process.env.NUXT_PUBLIC_LANDING_PAGE_URL ||
      'https://monsuivisocial.incubateur.anct.gouv.fr'
  },
  scalingo: {
    apiToken: process.env.SCALINGO_API_TOKEN || '',
    appName: process.env.SCALINGO_APP_NAME || '',
    region: process.env.SCALINGO_REGION || 'osc-fr1'
  },
  document: {
    migration: {
      maxDurationHours: parseFloat(process.env.MAX_DURATION_HOURS || '3')
    }
  }
}
