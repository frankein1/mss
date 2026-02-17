import * as Sentry from '@sentry/nuxt'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

// Sentry on the server side is loaded before runtime config setup
Sentry.init({
  dsn: useRuntimeConfig().public.sentry.dsn,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: useRuntimeConfig().public.sentry.tracesSampleRate,

  // Server side profiling for performance analysis
  profileSessionSampleRate:
    useRuntimeConfig().public.sentry.profileSessionSampleRate,
  profileLifecycle: 'trace',

  integrations: [nodeProfilingIntegration(), Sentry.captureConsoleIntegration],

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending of user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: useRuntimeConfig().public.sentry.debug
})
