export function useEnvironment() {
  const { public: publicConfig } = useRuntimeConfig()

  return {
    isProduction: publicConfig.mssEnvironment === 'production'
  }
}
