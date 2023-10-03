export async function useTrpcMutation<T>({
  mutation,
  isSubmitting,
  onSuccess,
  onFailure,
  onFinally
}: {
  mutation: () => Promise<T>
  isSubmitting?: Ref<boolean>
  onSuccess?: (res: T) => void
  onFailure?: () => void
  onFinally?: () => void
}) {
  if (isSubmitting) {
    isSubmitting.value = true
  }

  try {
    const res = await mutation()

    if (onSuccess) {
      onSuccess(res)
    }
  } catch {
    if (onFailure) {
      onFailure()
    }
  } finally {
    if (isSubmitting) {
      isSubmitting.value = false
    }

    if (onFinally) {
      onFinally()
    }
  }
}
