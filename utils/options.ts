export const NEW_OPTION_ID = 'new-option'
export const NEW_OPTION_PREFIX = `${NEW_OPTION_ID}-`

type OptionType = { value: string; label: string }
export type Options = Array<OptionType>

type OptionWithDisabled = OptionType & { disabled?: boolean }
export type OptionsWithDisabled = Array<OptionWithDisabled>

export function labelsToOptions(labels: Record<string, string>): Options {
  return Object.entries(labels).map(([value, label]) => ({ label, value }))
}

export function getOptionValues(options: Options) {
  return options.map(o => o.value)
}

export function getOptionLabels(options: Options) {
  return options.map(o => o.label)
}

export function getOption(options: Options, value: string) {
  return options.find(o => o.value === value)
}

export function hasOption(options: Options, value: string) {
  return !!options.find(o => o.value === value)
}

export function getOptionLabel(options: Options, value: string) {
  const option = getOption(options, value)
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
