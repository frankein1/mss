export function useClientVersion() {
  const {
    public: {
      version: { commitRefName, commitSha, commitTag }
    }
  } = useRuntimeConfig()

  const repo =
    'https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2'

  const commitUrl = `${repo}/-/commit/${commitSha}`
  const branchUrl = `${repo}/-/tree/${commitRefName}`

  const sourceCode = commitTag ? branchUrl : commitUrl
  const version = commitTag || commitSha.substring(0, 8)

  return { sourceCode, version }
}
