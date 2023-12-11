type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
}

type DateKeys<T> = KeyOfType<T, Date | '' | null | undefined>
type TWithSanitizedDates<T> = Omit<T, DateKeys<T>> & {
  [k in DateKeys<T>]: Date | null | undefined
}

// FIXME: Crazy type problem here... If someone is interested in improving it one day
export function prepareDateFields<T>(
  input: T,
  dateKeys: Array<DateKeys<T>>
): TWithSanitizedDates<T> {
  let sanitizedInput = { ...input }
  dateKeys.forEach(dateKey => {
    if (sanitizedInput[dateKey] === '') {
      sanitizedInput = {
        ...sanitizedInput,
        [dateKey]: null
      }
    }
  })

  return sanitizedInput as TWithSanitizedDates<T>
}
