import type { Structure } from '@prisma/client'
import dayjs from 'dayjs'
import { isInactive } from './isInactive'

/** Number of alert emails that must have been sent before disabling. */
const REQUIRED_ALERT_EMAILS = 2

/** Delay after `deactivationAlertEmailDate` before a structure can be disabled.
 * 4 weeks and not 2: `deactivationAlertEmailDate` is only set when the FIRST email
 * is sent and is never refreshed for the second one, so it is 2 weeks until the
 * second email plus 2 weeks of grace period.
 * (see scheduler/email/create-emails-for-inactive-structures.ts)
 */
const ALERT_EMAIL_GRACE_WEEKS = 4

/** A structure can be disabled once it is inactive AND the 2 emails warning of
 * impending deactivation have been sent, with a grace period after the last one.
 * Mirrors the automatic job in scheduler/structure/disable-inactive-structures.ts
 */
export const canBeDisabled = (
  structure: Pick<
    Structure,
    | 'lastAccess'
    | 'created'
    | 'deactivationAlertEmail'
    | 'deactivationAlertEmailDate'
  >
) => {
  if (!isInactive(structure)) {
    return false
  }

  if (structure.deactivationAlertEmail < REQUIRED_ALERT_EMAILS) {
    return false
  }

  if (!structure.deactivationAlertEmailDate) {
    return false
  }

  return dayjs(structure.deactivationAlertEmailDate).isBefore(
    dayjs().subtract(ALERT_EMAIL_GRACE_WEEKS, 'week')
  )
}
