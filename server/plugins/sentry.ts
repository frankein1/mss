import * as Sentry from '@sentry/node'
import { H3Error } from 'h3'

export default defineNitroPlugin(nitroApp => {
  const {
    public: { sentry }
  } = useRuntimeConfig()

  if (!sentry.dsn) {
    return
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentry.dsn,
    tracesSampleRate: sentry.tracesSampleRate
  })

  nitroApp.hooks.hook('error', error => {
    if (error instanceof H3Error) {
      if (error.statusCode === 404 || error.statusCode === 422) {
        return
      }
    }

    Sentry.captureException(error)
  })

  // Do not add Sentry in request context for now as we may not encounter this use case in our requests code

  nitroApp.hooks.hookOnce('close', async () => {
    await Sentry.close(2000)
  })
})
