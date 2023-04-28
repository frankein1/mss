import dayjs from 'dayjs'
import 'dayjs/locale/fr.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'

export default defineNuxtPlugin(() => {
  // This is the documented way to load locale https://day.js.org/docs/en/i18n/loading-into-nodejs
  /* eslint-disable import/no-named-as-default-member */
  dayjs.locale('fr')
  dayjs.extend(isBetween)
  dayjs.extend(isSameOrBefore)
  dayjs.extend(isSameOrAfter)
  /* eslint-enable import/no-named-as-default-member */

  return {
    provide: {
      dayjs
    }
  }
})
