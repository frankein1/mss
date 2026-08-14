import dayjs from 'dayjs'
import 'dayjs/locale/fr.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

export default defineNuxtPlugin(() => {
  // This is the documented way to load locale https://day.js.org/docs/en/i18n/loading-into-nodejs

  dayjs.locale('fr')
  dayjs.extend(isBetween)
  dayjs.extend(isSameOrBefore)
  dayjs.extend(isSameOrAfter)
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  return {
    provide: {
      dayjs
    }
  }
})
