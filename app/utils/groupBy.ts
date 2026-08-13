export default function groupBy<K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K
): Partial<Record<K, T[]>> {
  const output: Partial<Record<K, T[]>> = {}
  const array: T[] = Array.isArray(items) ? items : Array.from(items)
  array.forEach((item, index) => {
    const key = keySelector(item, index)
    if (!output[key]) {
      output[key] = []
    }
    output[key].push(item)
  })

  return output
}
