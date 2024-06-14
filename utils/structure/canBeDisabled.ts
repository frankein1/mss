import { Structure } from '@prisma/client'
import dayjs from 'dayjs'

export const canBeDisabled = (structure: Pick<Structure, 'lastAccess'>) => {
  if (!structure.lastAccess) {
    return true
  }
  const lowerLimit = dayjs(dayjs()).subtract(6, 'month').subtract(2, 'week')

  return dayjs(structure.lastAccess).isBefore(lowerLimit)
}
