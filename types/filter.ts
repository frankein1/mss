import type { FilterType } from '~/utils/constants/filters'
import type { Options } from '~/utils/options'

type FilterPropBase = {
  name: string
  label: string
}

export type SelectFilterProp = FilterPropBase & {
  options: Options
}

export type SelectOneFilterProp = SelectFilterProp & {
  type: FilterType.SelectOne
}

export type SelectMultipleFilterProp = SelectFilterProp & {
  type: FilterType.SelectMultiple
}

export type DateFilterProp = FilterPropBase & {
  type: FilterType.Date
}

export type FilterProp =
  | DateFilterProp
  | SelectOneFilterProp
  | SelectMultipleFilterProp

export type SelectedFilter = {
  filterLabel: string
  value: string
  valueLabel: string
}

export type SelectedFilters = {
  [name: string]: SelectedFilter
}
