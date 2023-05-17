import type {
  BeneficiarySort,
  FollowupSort,
  HelpRequestSort
} from '~/types/table'

export function useSort<
  S extends BeneficiarySort | FollowupSort | HelpRequestSort
>(orderBy: Ref<S[]>) {
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
