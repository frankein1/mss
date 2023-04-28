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
) {
  return new Map<string, string>(arr.map(e => [e[valueKey], e[labelKey]]))
}

export function withEmptyValue(map: Map<string, string>, emptyLabel = '') {
  return new Map([['', emptyLabel], ...map.entries()])
}
