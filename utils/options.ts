export const NEW_OPTION_ID = 'new-option'
export const NEW_OPTION_PREFIX = `${NEW_OPTION_ID}-`

export type Options = Map<string, string>

export const labelsToOptions = (object: Record<string, string>): Options =>
  new Map(Object.entries(object))

export const arrayToOptions = <T extends string>(
  values: readonly T[] | T[]
): Options => new Map(values.map(value => [value, value]))

export function toOptions<V extends string, L extends string>(
  arr: Array<Record<V | L, string>>,
  valueKey: V,
  labelKey: L
): Options {
  return new Map(arr.map(e => [e[valueKey], e[labelKey]]))
}

export function withEmptyValue(map: Options, emptyLabel = '') {
  return new Map([['', emptyLabel], ...map.entries()])
}

/**
 * Map a created option from a searchable select to the input label
 */
export function newOptionToLabel(newOption: string) {
  return newOption.replace(NEW_OPTION_PREFIX, '').replace('_', ' ')
}
