export const SCHEDULER_ENV = {
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
  public: {
    mssEnvironment: process.env.NUXT_PUBLIC_MSS_ENVIRONMENT || 'local',
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
  }
}
