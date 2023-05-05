import { getRandomId } from '~/utils/random'

export function useFormFieldId(name: string) {
  const randomId = getRandomId(`${name}-`)
  return { id: randomId, errorId: `${randomId}-error-desc-error` }
}
