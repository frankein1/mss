import { Structure } from '@prisma/client'
import dayjs from 'dayjs'

export const canBeDisabled = (
  structure: Pick<Structure, 'lastAccess' | 'created'>
) => {
  return dayjs(structure.lastAccess || structure.created).isBefore(
    dayjs(dayjs()).subtract(6, 'month').subtract(2, 'week')
  )
}
