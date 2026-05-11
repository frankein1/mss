import type { FilterType } from '~/utils/constants/filters'
import type { Options } from '~/utils/options'
import type { EventCategory, EventAction } from '~/types/matomo'

type FilterPropBase = {
  name: string
  label: string
  placeholder?: string
  hint?: string
  alwaysExpanded?: boolean
  matomoEventCategory?: EventCategory
  matomoEventAction?: EventAction
  disabled?: boolean
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

export type SearchFilterProp = FilterPropBase & {
  type: FilterType.Search
}

export type RadioFilterProp = SelectFilterProp & {
  type: FilterType.Radio
  asTag?: boolean
  noLabel?: boolean
  pictos?: Record<string, string>
  rich?: boolean
}

export type NumberFilterProp = FilterPropBase & {
  type: FilterType.Number
}

export type NotFilledFilterProp = SelectFilterProp & {
  type: FilterType.NotFilled
}

export type FilterProp =
  | DateFilterProp
  | SelectOneFilterProp
  | SelectMultipleFilterProp
  | SearchFilterProp
  | RadioFilterProp
  | NumberFilterProp
  | NotFilledFilterProp

export type SelectedFilter = {
  filterLabel: string
  value: string | string[]
  valueLabel: string
}

export type SelectedFilters = {
  [name: string]: SelectedFilter
}

export type FilterValue = string | string[] | Date | number

export type FilterValues = {
  [filterName: string]: FilterValue | null | undefined
}
