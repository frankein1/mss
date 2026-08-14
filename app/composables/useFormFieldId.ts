export function useFormFieldId(name: Ref<string>) {
  const id = useId()
  const randomId = computed(() => `${name.value}-` + id)
  const errorId = computed(() => `${randomId.value}-error-desc-error`)

  return { id: randomId, errorId }
}
