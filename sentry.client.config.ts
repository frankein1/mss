import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  dsn: useRuntimeConfig().public.sentry.dsn,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: useRuntimeConfig().public.sentry.tracesSampleRate,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: useRuntimeConfig().public.sentry.replaySampleRate,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // If you don't want to use Session Replay, just remove the line below:
  integrations: [
    Sentry.browserTracingIntegration({ router: useRouter() }),
    Sentry.replayIntegration(),
    Sentry.captureConsoleIntegration()
  ],

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending of user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: useRuntimeConfig().public.sentry.debug
})
