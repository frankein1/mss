/** If perPage < 0, no pagination is performed */
export const takeAndSkipFromPagination = ({
  page,
  perPage
}: {
  page: number
  perPage: number
}): { take: number | undefined; skip: number | undefined } =>
  perPage < 0
    ? { take: undefined, skip: undefined }
    : {
        take: perPage,
        skip: (page - 1) * perPage
      }
