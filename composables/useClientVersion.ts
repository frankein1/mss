export function useClientVersion() {
  const {
    public: {
      version: { commitRefName, commitSha, commitTag }
    }
  } = useRuntimeConfig()

  const repo =
    'https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/tree'

  const sourceCode = `${repo}/${commitRefName}`
  const version = commitTag || commitSha.substring(0, 8)

  return { sourceCode, version }
}
