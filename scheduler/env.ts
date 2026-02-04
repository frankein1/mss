function getenvString(varname: string, defaultValue = '', isPublic = false) {
  const pb = isPublic ? 'PUBLIC_' : ''

  return (
    process.env[`NUXT_${pb}${varname}`] || process.env[varname] || defaultValue
  )
}

function getenvBool(
  varname: string,
  defaultValue: 'true' | 'false' = 'false',
  isPublic = false
) {
  const pb = isPublic ? 'PUBLIC_' : ''
  return (
    (process.env[`NUXT_${pb}${varname}`] ||
      process.env[varname] ||
      defaultValue ||
      'false') === 'true'
  )
}

function getenvFloat(varname: string, defaultValue = '0', isPublic = false) {
  const pb = isPublic ? 'PUBLIC_' : ''

  return parseFloat(
    process.env[`NUXT_${pb}${varname}`] || process.env[varname] || defaultValue
  )
}

function getenvInt(varname: string, defaultValue = '0', isPublic = false) {
  const pb = isPublic ? 'PUBLIC_' : ''

  return parseInt(
    process.env[`NUXT_${pb}${varname}`] || process.env[varname] || defaultValue
  )
}

export const SCHEDULER_ENV = {
  email: {
    smtpHost: getenvString('EMAIL_SMTP_HOST'),
    smtpPort: getenvInt('EMAIL_SMTP_PORT', '587'),
    smtpSecure: getenvBool('EMAIL_SMTP_SECURE'),
    smtpUser: getenvString('EMAIL_SMTP_USER'),
    smtpPassword: getenvString('EMAIL_SMTP_PASSWORD')
  },
  anonymizer: {
    readonlyDatabaseUrl: getenvString('READONLY_DATABASE_URL'),
    anonymizedDatabaseUrl: getenvString('ANONYMIZED_DATABASE_URL')
  },
  public: {
    mssEnvironment: getenvString('MSS_ENVIRONMENT', 'local', true),
    email: {
      from: getenvString('EMAIL_FROM', '', true)
    },
    sentry: {
      dsn: getenvString('SENTRY_DSN', '', true),
      debug: getenvBool('SENTRY_DEBUG', 'false', true),
      tracesSampleRate: getenvFloat('SENTRY_TRACE_SAMPLE_RATE', '0.1', true)
    }
  }
}
