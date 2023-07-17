import type { TableSort } from '~/types/table'

export function useSort<S extends TableSort>(orderBy: Ref<S[]>) {
  function onSort(sort: S) {
    orderBy.value = orderBy.value.filter(
      s => Object.keys(s)[0] !== Object.keys(sort)[0]
    )
    if (!Object.values(sort)) {
      return
    }
    orderBy.value.unshift(sort)
  }

  return { onSort }
}
