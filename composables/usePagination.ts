export function usePagination(page: Ref<number>, perPage: Ref<number>) {
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
