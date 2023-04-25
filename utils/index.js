
export function dateIsSameOrBefore(date, upper) {
  return date.isSameOrBefore(upper, 'day')
}

export function dateIsSameOrAfter(date, lower) {
  return date.isSameOrAfter(lower, 'day')
}

export function dateIsBetween(date, lower, upper) {
  return date.isBetween(lower, upper, 'day', '[]')
}

export function toOptions(arr, valueKey, labelKey) {
  return new Map(arr.map(e => [e[valueKey], e[labelKey]]))
}

export function withEmptyValue(a, emptyLabel = '') {
  return new Map([['', emptyLabel], ...a.entries()])
}

/**
 * Sort an array of objects
 * @param array An array of objects
 * @param sorts An array of sort objects. It has a field key that corresponds to the field to sort and a sort key that indicates if sorting is applied ascending or descending
 */
export function sort(array, sorts) {
  return array.sort((a, b) => {
    return sorts.reduce((delta, sort) => {
      if (delta) return delta

      const valueA = getNestedValue(a, sort.field)
      const valueB = getNestedValue(b, sort.field)

      if (!valueA && !valueB) return 0
      if (!valueA) return -parseInt(`${sort.sort}1`)
      if (!valueB) return parseInt(`${sort.sort}1`)

      if (typeof valueA !== 'string' || typeof valueB !== 'string') {
        throw new TypeError(
          'Not Implemented : Nested sort only handles string for now.'
        )
      }

      const insensitiveA = valueA.toLowerCase()
      const insensitiveB = valueB.toLowerCase()

      if (insensitiveA < insensitiveB) return -parseInt(`${sort.sort}1`)
      if (insensitiveA > insensitiveB) return parseInt(`${sort.sort}1`)
      return 0
    }, 0)
  })
}



