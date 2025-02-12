import dayjs from 'dayjs'

export function formatTime(date?: Date | null) {
  if (!date) {
    return ''
  }
  return dayjs(date).format('HH[h]mm')
}
