import dayjs from 'dayjs'
/**
 * This method converts the given time to UTC without preserving the original time
 * eg. `new Date('2024-02-04T12:00:00+12:00')` -> `2024-02-04T00:00:000Z` -> `00h00`
 * @param {string} date - A JavaScript Date object.
 */
export function getUTCTimeFromDate(date?: Date | null) {
  if (!date) {
    return ''
  }

  return dayjs(date).utc().format('HH[h]mm')
}
