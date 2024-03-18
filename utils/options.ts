export const NEW_OPTION_ID = 'new-option'
export const NEW_OPTION_PREFIX = `${NEW_OPTION_ID}-`

type OptionType = { value: string; label: string }
export type Options = Array<OptionType>

export function labelsToOptions(labels: Record<string, string>): Options {
  return Object.entries(labels).map(([value, label]) => ({ label, value }))
}

export const isNewOption = (value?: string | null) => {
  return value ? value.startsWith(NEW_OPTION_PREFIX) : false
}

export function getOptionValues(options: Options) {
  return options.map(o => o.value)
}

export function getOptionLabels(options: Options) {
  return options.map(o => o.label)
}

export function findOption(options: Options, value: string) {
  return options.find(o => o.value === value)
}

export function hasOption(options: Options, value: string) {
  return !!options.find(o => o.value === value)
}

export function findOptionLabel(options: Options, value: string) {
  const option = findOption(options, value)
  return option ? option.label : value
}

export function toOptions<V extends string, L extends string>(
  arr: Array<Record<V | L, string>>,
  valueKey: V,
  labelKey: L
): Options {
  return arr.map(e => ({ value: e[valueKey], label: e[labelKey] }))
}

export function withEmptyValue(options: Options, emptyLabel = '') {
  return [{ label: emptyLabel, value: '' }, ...options]
}

/**
 * Map a created option from a searchable select to the input label
 */
export function newOptionToLabel(newOption: string) {
  return newOption.replace(NEW_OPTION_PREFIX, '').replace('_', ' ')
}
