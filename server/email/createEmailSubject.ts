export const createEmailSubject = (subject: string) => {
  const { public: publicConfig } = useRuntimeConfig()
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
