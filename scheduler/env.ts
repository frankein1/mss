const { email: emailConfig, public: publicConfig } = useRuntimeConfig()

export const SCHEDULER_ENV = {
  email: {
    smtpHost: emailConfig.smtpHost,
    smtpPort: emailConfig.smtpPort,
    smtpSecure: emailConfig.smtpSecure,
    smtpUser: emailConfig.smtpUser,
    smtpPassword: emailConfig.smtpPassword
  },
  anonymizer: {
    readonlyDatabaseUrl: process.env['NUXT_READONLY_DATABASE_URL'],
    anonymizedDatabaseUrl: process.env['NUXT_ANONYMIZED_DATABASE_URL']
  },
  public: {
    mssEnvironment: publicConfig.mssEnvironment,
    email: {
      from: publicConfig.email.from
    },
    sentry: {
      dsn: publicConfig.sentry.dsn,
      debug: publicConfig.sentry.debug,
      tracesSampleRate: publicConfig.sentry.tracesSampleRate
    },
    landingPageUrl:
      publicConfig.landingPageUrl ||
      'https://monsuivisocial.incubateur.anct.gouv.fr'
  }
}
