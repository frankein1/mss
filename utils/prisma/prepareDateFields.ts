type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
}

type DateKeys<T> = KeyOfType<T, Date | '' | null | undefined>
type TWithSanitizedDates<T, K extends DateKeys<T>> = Omit<T, K> & {
  [k in K]: Date | null | undefined
}