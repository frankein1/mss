export function useDefer<U, T extends U[]>(
  deferDuration: number,
  callable: (...args: T) => void
) {
  const timeout = ref<NodeJS.Timeout | null>(null)

  function deferredCallable(...args: T) {
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }

    timeout.value = setTimeout(() => {
      callable(...args)
    }, deferDuration)
  }

  return deferredCallable
}
