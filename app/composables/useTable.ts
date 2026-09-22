import { focusAndScrollTo } from '~/utils/focusAndScrollTo'

export function useTable(pending: Ref<boolean>) {
  const tableContainer = useTemplateRef<HTMLDivElement>('tableContainer')

  // Do not move the focus at first load
  let hasLoadedOnce = false

  watch(
    pending,
    p => {
      if (p) {
        return
      }
      if (!hasLoadedOnce) {
        hasLoadedOnce = true
        return
      }
      const tableContainerValue = tableContainer.value
      // Scroll the table container to top after reloading
      if (tableContainerValue) {
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
