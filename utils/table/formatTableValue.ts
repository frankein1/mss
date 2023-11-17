import { EMPTY_TABLE_CELL } from '~/utils/constants'

export const formatTableValue = (value: string | null | undefined) => {
  return value?.length ? value : EMPTY_TABLE_CELL
}
