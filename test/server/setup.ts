import { vi } from 'vitest'

import dayjs from 'dayjs'
import 'dayjs/locale/fr.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.locale('fr')
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(utc)
dayjs.extend(timezone)

/** The vitest 4 environment being not isolated (see vitest.config.ts)
 * The mocks are defined globally otherwise with vitest >= 4 the real
 * module import would be cached by other tests and the mocks not
 * applied when needed
 */
vi.mock('~/server/lib/encryption/kms')
vi.mock('~/server/lib/data-inclusion')
