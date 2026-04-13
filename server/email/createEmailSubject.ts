import type { EnvironmentConfig } from '~/types/environmentConfig'

export const createEmailSubject = (
  subject: string,
  config: EnvironmentConfig
) => {
  const { public: publicConfig } = config
  const { mssEnvironment } = publicConfig
  if (mssEnvironment === 'development') {
    return `[DEV] ${subject}`
  }
  if (mssEnvironment === 'local') {
    return `[LOCAL] ${subject}`
  }
  if (mssEnvironment === 'demo') {
    return `[DEMO] ${subject}`
  }
  return subject
}
