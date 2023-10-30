import { focusAndScrollTo } from '~/utils/focusAnScrollTo'
import type { TableSort } from '~/types/table'

export function useTable<S extends TableSort>(
  sort: Ref<S[]>,
  pending: Ref<boolean>,
  emit: (e: 'update:sort', sort: S[]) => void
) {
  const tableContainer = ref<HTMLDivElement | null>(null)
  const sortRef = ref(sort.value) as Ref<S[]>

  const { onSort } = useSort<S>(sortRef)

  watch(
    pending,
    p => {
      const tableContainerValue = tableContainer.value
      // Scroll the table container to top after reloading
      if (tableContainerValue && !p) {
        nextTick(() => {
          focusAndScrollTo(tableContainerValue)
          tableContainerValue.scrollTop = 0
        })
      }
    },
    { deep: true }
  )

  // Update the inner ref when the sort prop changes
  watch(sort, s => {
    sortRef.value = s
  })

  // Emit the update when the inner ref is updated (in onSort method)
  watch(sortRef, sort => {
    emit('update:sort', sort)
  })

  return { tableContainer, onSort }
}
