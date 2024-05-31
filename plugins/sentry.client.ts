import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const {
    public: { sentry }
  } = useRuntimeConfig()

  if (!sentry.dsn) {
    return
  }

  const router = useRouter()

  Sentry.init({
    app: nuxtApp.vueApp,
    debug: sentry.debug,
    dsn: sentry.dsn,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration()
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: sentry.tracesSampleRate,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  })

  return {
    provide: {
      sentry: {
        setContext: Sentry.setContext,
        setUser: Sentry.setUser,
        setTag: Sentry.setTag,
        addBreadcrumb: Sentry.addBreadcrumb,
        captureException: Sentry.captureException
      }
    }
  }
})
