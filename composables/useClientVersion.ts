export function useClientVersion() {
  const {
    public: {
      version: { commitRefName, commitSha, commitTag }
    }
  } = useRuntimeConfig()

  const repo =
    'https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/tree'

  const sourceCode = `${repo}/v${commitRefName}`
  const version = commitTag || commitSha.substring(0, 7)

  return { sourceCode, version }
}
