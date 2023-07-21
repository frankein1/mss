import type { FilterType } from '~/utils/constants/filters'
import type { Options } from '~/utils/options'
import type { EventCategory, EventAction } from '~/types/matomo'

type FilterPropBase = {
  name: string
  label: string
  matomoEventCategory?: EventCategory
  matomoEventAction?: EventAction
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
  value: string | string[]
  valueLabel: string
}

export type SelectedFilters = {
  [name: string]: SelectedFilter
}
