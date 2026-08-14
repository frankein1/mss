import { focusAndScrollTo } from '~/utils/focusAndScrollTo'

export function useTable(pending: Ref<boolean>) {
  const tableContainer = useTemplateRef<HTMLDivElement>('tableContainer')

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

  return { tableContainer }
}
