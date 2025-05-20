import dayjs from 'dayjs'

/**
 * Format UTC timestamps generated on server side
 * The server and the DB being in UTC timezone, no conversion is needed
 */
export function formatUTCTimestamp(date?: Date | null, format = 'DD/MM/YYYY') {
  if (!date) {
    return ''
  }

  return dayjs(date).format(format)
}
