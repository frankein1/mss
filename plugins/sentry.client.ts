import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin(nuxtApp => {
  const { public: publicConfig } = useRuntimeConfig()
  const router = useRouter()

  Sentry.init({
    enabled:
      publicConfig.mssEnvironment === 'production' ||
      publicConfig.mssEnvironment === 'development', // FIXME: On deploy to production, remove sentry from development
    app: nuxtApp.vueApp,
    debug: publicConfig.mssEnvironment !== 'production',
    dsn: publicConfig.sentry.dsn,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
      }),
      new Sentry.Replay()
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate:
      publicConfig.mssEnvironment === 'production' ||
      publicConfig.mssEnvironment === 'development'
        ? 0.2
        : 1.0, // FIXME: On deploy to production, remove sentry from development

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
