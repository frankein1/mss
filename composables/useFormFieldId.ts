import { getRandId } from '~/utils/random'

export function useFormFieldId(name: Ref<string>) {
  const randomId = computed(() => getRandId(`${name.value}-`))
  const errorId = computed(() => `${randomId.value}-error-desc-error`)

  return { id: randomId, errorId }
}
