import { Dayjs } from 'dayjs'

export function dateIsSameOrBefore(date: Dayjs, upper: Dayjs): boolean {
  return date.isSameOrBefore(upper, 'day')
}

export function dateIsSameOrAfter(date: Dayjs, lower: Dayjs): boolean {
  return date.isSameOrAfter(lower, 'day')
}

export function dateIsBetween(
  date: Dayjs,
  lower: Dayjs,
  upper: Dayjs
): boolean {
  return date.isBetween(lower, upper, 'day', '[]')
}

/**
 * Get a value within an object from a field path
 * @param obj The object
 * @param field The field path in dot notation (i.e. : 'foo.bar.baz')
 */
export function getNestedValue(obj: Object, field: string) {
  const [firstNestedField, ...followingNestedFields] = field.split('.')
  if (!(firstNestedField in obj)) {
    return undefined
  }
  const nestedValue = obj[firstNestedField]
  if (followingNestedFields.length) {
    if (typeof nestedValue === 'object' && nestedValue) {
      return getNestedValue(nestedValue, followingNestedFields.join('.'))
    }
    return undefined
  }
  return nestedValue
}

/**
 * Sort an array of objects
 * @param array An array of objects
 * @param sorts An array of sort objects. It has a field key that corresponds to the field to sort and a sort key that indicates if sorting is applied ascending or descending
 */
export function sort(
  array: Array<Object>,
  sorts: Array<{ field: string; sort: string }>
) {
  return array.sort((a, b) => {
    return sorts.reduce((delta, sort) => {
      if (delta) {
        return delta
      }

      const valueA = getNestedValue(a, sort.field)
      const valueB = getNestedValue(b, sort.field)

      if (!valueA && !valueB) {
        return 0
      }
      if (!valueA) {
        return -parseInt(`${sort.sort}1`)
      }
      if (!valueB) {
        return parseInt(`${sort.sort}1`)
      }

      if (typeof valueA !== 'string' || typeof valueB !== 'string') {
        throw new TypeError(
          'Not Implemented : Nested sort only handles string for now.'
        )
      }

      const insensitiveA = valueA.toLowerCase()
      const insensitiveB = valueB.toLowerCase()

      if (insensitiveA < insensitiveB) {
        return -parseInt(`${sort.sort}1`)
      }
      if (insensitiveA > insensitiveB) {
        return parseInt(`${sort.sort}1`)
      }
      return 0
    }, 0)
  })
}

export * from './beneficiary'
