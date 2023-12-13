type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
}

type DateKeys<T> = KeyOfType<T, Date | '' | null | undefined>
type TWithSanitizedDates<T, K extends DateKeys<T>> = Omit<T, K> & {
  [k in K]: Date | null | undefined
}

// FIXME: Crazy type problem here... If someone is interested in improving it one day
export function prepareDateFields<T, K extends DateKeys<T>>(
  input: T,
  dateKeys: Array<K>
): TWithSanitizedDates<T, K> {
  let sanitizedInput = { ...input }
  dateKeys.forEach(dateKey => {
    if (sanitizedInput[dateKey] === '') {
      sanitizedInput = {
        ...sanitizedInput,
        [dateKey]: null
      }
    }
  })

  return sanitizedInput as TWithSanitizedDates<T, K>
}
