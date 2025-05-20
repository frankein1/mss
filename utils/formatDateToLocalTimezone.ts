import dayjs from 'dayjs'

/**
 * This method formats the date in local timezone. It is the default behaviour of dayjs.
 * eg. `new Date('2024-02-04T12:00:00+12:00')` -> `2024/02/04`
 *
 * Dates entered by a user in a form should not be converted to local time.
 * So it SHOULD NOT be used to display dates entered by the user in a calendar field for instance.
 *
 * It SHOULD be used to display timestamps from the server in the client.
 *
 * @param {string} date - A JavaScript Date object.
 */
export function formatDateToLocalTimezone(
  date?: Date | null,
  format = 'DD/MM/YYYY'
) {
  if (!date) {
    return ''
  }
  return dayjs(date).format(format)
}
