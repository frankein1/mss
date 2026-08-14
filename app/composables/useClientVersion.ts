import { CODE_URL } from '~/utils/constants'

export function useClientVersion() {
  const {
    public: {
      version: { commitRefName, commitSha, commitTag }
    }
  } = useRuntimeConfig()

  const commitUrl = `${CODE_URL}/-/commit/${commitSha}`
  const branchUrl = `${CODE_URL}/-/tree/${commitRefName}`

  const sourceCode = commitTag ? branchUrl : commitUrl
  const version = commitTag || commitSha.substring(0, 8)

  return { sourceCode, version }
}
