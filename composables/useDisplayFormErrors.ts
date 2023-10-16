import { FormErrors, GenericObject } from 'vee-validate'
import type { FieldLabels } from '~/types/fieldLabels'

function isDefinedError(
  error: [string, string | undefined]
): error is [string, string] {
  return !!error[1]
}

function focusErroredField(form: HTMLFormElement, fieldName: string) {
  const erroredField = form.querySelector<HTMLElement>(`[name=${fieldName}]`)
  if (erroredField) {
    erroredField.focus()
  }
}

export function useDisplayFormErrors<T extends GenericObject>(
  form: Ref<HTMLFormElement | null>,
  caughtErrors: Ref<FormErrors<T>>,
  fieldLabels: FieldLabels<Partial<T>>
) {
  const errorsArray = computed(() =>
    Object.entries<string | undefined>(caughtErrors.value).filter(
      isDefinedError
    )
  )

  const errors = computed(() =>
    errorsArray.value.map(([erroredFieldName, errorMessage]) => {
      const name = erroredFieldName.slice(erroredFieldName.lastIndexOf('.') + 1)
      const label = fieldLabels[name]
      return { name, message: `${label} : ${errorMessage}` }
    })
  )

  watch(errorsArray, errorsArray => {
    if (!form.value || errorsArray.length > 1) {
      return
    }

    if (errorsArray.length === 0) {
      return
    }

    const [erroredFieldName] = errorsArray[0]
    focusErroredField(form.value, erroredFieldName)
  })

  return { errors }
}
