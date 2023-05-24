import dayjs from 'dayjs'

export function formatDate(date?: Date | null, format = 'DD/MM/YYYY') {
  if (!date) {
    return ''
  }
  return dayjs(date).format(format)
}
