import { reloadNuxtApp } from 'nuxt/app'
import { minutesToMillis } from '~/utils/time'

export default defineNuxtPlugin(nuxtApp => {
  // use runtimeConfig
  const {
    public: { version }
  } = useRuntimeConfig()

  let refreshAppInterval: NodeJS.Timeout

  nuxtApp.hook('app:mounted', () => {
    const intervalTime = minutesToMillis(1)

    refreshAppInterval = setInterval(async () => {
      const { version: serverVersion } = await getVersion()
      if (serverVersion !== version.commitSha) {
        if (
          window.confirm(
            'Une nouvelle version de Mon Suivi Social est disponible.'
          )
        ) {
          reloadNuxtApp()
        }
      }
    }, intervalTime)
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    if (refreshAppInterval) {
      clearInterval(refreshAppInterval)
    }

    _unmount()
  }
})

function getVersion() {
  return $fetch<JwtUser>('/api/version')
}
