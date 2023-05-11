import type { FilterType } from '~/utils/constants/filters'
import type { Options } from '~/utils/options'

type FilterPropBase = {
  name: string
  label: string
}

type SelectFilterProp = FilterPropBase & {
  type: FilterType.SelectOne | FilterType.SelectMultiple
  options: Options
}

type DateFilterProp = FilterPropBase & {
  type: FilterType.Date
}

export type FilterProp = DateFilterProp | SelectFilterProp

export type SelectedFilter = {
  filterLabel: string
  value: string
  valueLabel: string
}

export type SelectedFilters = {
  [name: string]: SelectedFilter
}

export type FilterValues = { [key: string]: string | Date | Array<string> }
