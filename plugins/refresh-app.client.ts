import { minutesToMillis } from '~/utils/time'

const MSG =
  'Une nouvelle version de Mon Suivi Social est disponible. La page va être rechargée...'

export default defineNuxtPlugin(({ $config }) => {
  const version = $config.public.version

  if (version.commitSha) {
    let lastCheckTime = new Date()
    useRouter().afterEach(async () => {
      const lastCheckInterval = +new Date() - +lastCheckTime
      if (lastCheckInterval >= minutesToMillis(1)) {
        lastCheckTime = new Date()
        const { version: serverVersion } = await getVersion()

        if (serverVersion !== version.commitSha) {
          window.confirm(MSG)
          location.reload()
        }
      }
    })
  }
})

function getVersion() {
  return $fetch<{ version: string }>('/api/version')
}
