export function usePagination(
  page: Ref<number>,
  perPage: Ref<number>,
  filters?: Ref<
    Record<string, string | string[] | Date | boolean | undefined | null>
  >
) {
  if (filters) {
    watch(filters, () => {
      page.value = 1
    })
  }

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
