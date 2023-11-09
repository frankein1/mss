export function usePagination(
  page: Ref<number>,
  perPage: Ref<number>,
  filters: any
) {
  watch(filters, () => {
    page.value = 1
  })

  function updatePagination({
    pageNumber,
    limitValue
  }: {
    pageNumber: number
    limitValue: number
  }) {
    page.value = pageNumber
    perPage.value = limitValue
  }

  return { updatePagination }
}
