export function useFormData<T extends { [k: string]: string }>(event: Event) {
  if (!event.target) {
    throw new Error('Cannot get form from event without target')
  }

  const form = event.target as HTMLFormElement

  return { form, data: Object.fromEntries(new FormData(form)) as T }
}
