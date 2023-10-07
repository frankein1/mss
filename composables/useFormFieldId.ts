import { getRandomId } from '~/utils/random'

export function useFormFieldId(name: Ref<string>) {
  const randomId = computed(() => getRandomId(`${name.value}-`))
  const errorId = computed(() => `${randomId.value}-error-desc-error`)

  return { id: randomId, errorId }
}
