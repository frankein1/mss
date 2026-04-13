import type { Structure } from '@prisma/client'
import dayjs from 'dayjs'

/** A structure can be disabled when it has been inactive for 6 months
 * AND the 2 mails warning of impending deactivation have been sent (2 weeks after).
 * (see scheduler/email/create-emails-for-inactive-structures.ts)
 */
export const canBeDisabled = (
  structure: Pick<Structure, 'lastAccess' | 'created'>
) => {
  return dayjs(structure.lastAccess || structure.created).isBefore(
    dayjs(dayjs()).subtract(6, 'month').subtract(2, 'week')
  )
}
