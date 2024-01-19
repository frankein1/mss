export const NEW_OPTION_ID = 'new-option'
export const NEW_OPTION_PREFIX = `${NEW_OPTION_ID}-`

export type Options = Map<string, string>

type RichOptionValues =
  | {
      label: string
      picto: string
    }
  | {
      label: string
      icon: string
    }
export type RichOptions = Map<string, RichOptionValues>

export type OptionValues = string | RichOptionValues

export function labelsToOptions(labels: Record<string, string>): Options
export function labelsToOptions(
  labels: Record<string, string>,
  params: { pictos: Record<string, string> } | { icons: Record<string, string> }
): RichOptions
export function labelsToOptions(
  labels: Record<string, string>,
  params?:
    | { pictos: Record<string, string> }
    | { icons: Record<string, string> }
): Options | RichOptions {
  if (!params) {
    return new Map(Object.entries(labels))
  }
  if ('pictos' in params) {
    const labelsWithPictos = Object.fromEntries(
      Object.entries(labels).map(([value, label]) => [
        value,
        { label, picto: params.pictos[value] }
      ])
    )
    return new Map(Object.entries(labelsWithPictos))
  }
  const labelsWithIcons = Object.fromEntries(
    Object.entries(labels).map(([value, label]) => [
      value,
      { label, icon: params.icons[value] }
    ])
  )
  return new Map(Object.entries(labelsWithIcons))
}

export const isNewOption = (value?: string | null) => {
  return value ? value.startsWith(NEW_OPTION_PREFIX) : false
}

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
