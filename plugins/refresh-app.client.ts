import { minutesToMillis } from '~/utils/time'

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
          location.reload()
        }
      }
    })
  }
})

function getVersion() {
  return $fetch<{ version: string }>('/api/version')
}
