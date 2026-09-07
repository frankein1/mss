import type { Structure } from '@prisma/client'
import dayjs from 'dayjs'

/** Number of months without any connection before a structure is considered inactive.
 * Shared with scheduler/email/create-emails-for-inactive-structures.ts, which sends
 * the first alert email as soon as this threshold is reached.
 */
export const INACTIVITY_MONTHS = 6

/** A structure is inactive when nobody has logged in for 6 months.
 * `lastAccess` is only written on ProConnect login, so it falls back to `created`
 * for a structure nobody ever connected to.
 */
export const isInactive = (
  structure: Pick<Structure, 'lastAccess' | 'created'>
) =>
  dayjs(structure.lastAccess || structure.created).isBefore(
    dayjs().subtract(INACTIVITY_MONTHS, 'month')
  )
