// TODO: add optional parameter for on success or on failure for a better factorisation for mutations with try/catch in this composable
export function useTrpcClient() {
  const { $trpcClient } = useNuxtApp()

  return $trpcClient
}
