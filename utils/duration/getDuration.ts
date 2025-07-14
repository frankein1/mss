import dayjs from 'dayjs'

export const getDurationInHoursAndMinutes = (starDate: Date, endDate: Date) => {
  const diff = dayjs(endDate).diff(dayjs(starDate))
  if (diff <= 0) {
    return ''
  }
  return dayjs.duration(diff).format(getFormat(diff))
}

const getFormat = (diff: number) => {
  const minutes = diff / 1000 / 60 / 60
  if (minutes === 1) {
    return 'H [heure]'
  }
  if (minutes < 1) {
    return 'm [minutes]'
  }
  if (!Number.isInteger(minutes) && minutes < 2) {
    return 'H [heure] m [minutes]'
  }
  if (!Number.isInteger(minutes) && minutes >= 2) {
    return 'H [heures] m [minutes]'
  }
  return 'H [heures]'
}
