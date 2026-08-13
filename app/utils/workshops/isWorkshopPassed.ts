import dayjs from 'dayjs'

export const isWorkshopPassed = (
  workshopDate: Date,
  startTime: string | null,
  endTime: string | null
) => {
  const now = dayjs(new Date())
  let date = dayjs(new Date(workshopDate))
  if (endTime) {
    date = date.set('hour', Number(endTime.split(':')[0]))
    date = date.set('minute', Number(endTime.split(':')[1]))
  }
  if (startTime && endTime == null) {
    date = date.set('hour', Number(startTime.split(':')[0]))
    date = date.set('minute', Number(startTime.split(':')[1]))
  }
  return date < now
}
