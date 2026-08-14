import dayjs from 'dayjs'

/**
 * Format dates entered by user input.
 *
 * This method extract the date from a timestamp to UTC date without preserving the original time
 * eg. `new Date('2024-02-04T12:00:00+12:00')` -> `2024/02/04`
 *
 * It SHOULD be used to display dates entered by the user in a calendar field for instance.
 *
 * It SHOULD NOT be used to display timestamps from the server in the client.
 *
 * @param {string} date - A JavaScript Date object.
 */
export function formatDate(date?: Date | null, format = 'DD/MM/YYYY') {
  if (!date) {
    return ''
  }
  return dayjs(date).utc().format(format)
}
