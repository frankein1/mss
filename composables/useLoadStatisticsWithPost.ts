import { RouterOutput } from '~/server/trpc/routers'
import { StatFilterInput } from '~/server/schema'

export async function useLoadStatisticsWithPost<
  C extends keyof RouterOutput['stat']
>(caller: C, filters: Ref<StatFilterInput>) {
  const trpcClient = useTrpcClient()

  const error = ref<Error | null>(null)
  const pending = ref(false)
  const data = ref<RouterOutput['stat'][C] | null>(null)

  try {
    pending.value = true
    error.value = null

    // @ts-expect-error I don't know why
    data.value = await trpcClient.stat[caller].mutate(filters.value)
  } catch (e: unknown) {
    error.value = e as Error
    data.value = null
  } finally {
    pending.value = false
  }

  return { error, pending, data }
}
