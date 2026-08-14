import type { AppConfig } from '~~/types/appConfig'

export const createEmailSubject = (
  subject: string,
  config: Pick<AppConfig, 'public'>
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
