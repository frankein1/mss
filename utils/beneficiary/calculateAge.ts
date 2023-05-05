import dayjs from 'dayjs'

export function calculateAge(birthdate: Date) {
  return dayjs().diff(dayjs(birthdate), 'year')
}
