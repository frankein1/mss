export function useClientVersion() {
  const {
    public: { clientVersion, mssEnvironment }
  } = useRuntimeConfig()

  const repo =
    'https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/tree'

  let sourceCode = `${repo}/v${clientVersion}?ref_type=tags`
  let version = clientVersion

  if (mssEnvironment === 'development') {
    sourceCode = `${repo}/main?ref_type=heads`
    version = 'main'
  }

  return { sourceCode, version }
}
