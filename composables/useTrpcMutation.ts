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
  onFailure?: (err: unknown) => void
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
  } catch (err) {
    if (onFailure) {
      onFailure(err)
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
