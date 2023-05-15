import dayjs from 'dayjs'

export function formatDate(date: Date, format = 'DD/MM/YYYY') {
  if (!date) {
    return ''
  }
  return dayjs(date).format(format)
}
