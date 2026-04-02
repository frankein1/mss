import { performance } from 'node:perf_hooks'
import * as Sentry from '@sentry/node'
import { SCHEDULER_ENV } from './env'

/** Fail graciously upon exception and send log to sentry
 *
 * **WARNING** This should always be used when creating a scheduler job
 * otherwise the job will crash the container
 */
export async function withErrorCapture<Return>(
  fn: () => Promise<Return> | Return
) {
  const method = String(fn.name)
  const start = performance.now()

  try {
    return await fn()
  } catch (e: unknown) {
    console.error(`${method}: error during execution`)
    console.error(e)

    if (hasDefinedSentryEnv()) {
      Sentry.captureException(e)
    }
  } finally {
    const end = performance.now()
    const duration = (end - start) / 1000
    console.log(
      `${method}: [${new Date().toISOString()}]: duration: ${duration.toFixed(3)}s`
    )
  }
}

function hasDefinedSentryEnv() {
  return !!SCHEDULER_ENV.public.sentry.dsn
}

export function initSentry() {
  if (!hasDefinedSentryEnv()) {
    console.warn(`scheduler: [${new Date().toISOString()}]: no sentry client`)
    return false
  }

  const sentryDsn = SCHEDULER_ENV.public.sentry.dsn
  const tracesSampleRate = SCHEDULER_ENV.public.sentry.tracesSampleRate

  console.log(
    `scheduler: [${new Date().toISOString()}]: sentry client initialization`
  )
  Sentry.init({ dsn: sentryDsn, tracesSampleRate })

  return true
}

export async function terminateSentry() {
  if (!hasDefinedSentryEnv()) {
    return
  }

  await Sentry.close(2000)
  console.log(
    `scheduler: [${new Date().toISOString()}]: sentry client shutdown`
  )
}

// See https://typescriptpro.com/challenges/medium/kebabcase
export type SnakeCase<S extends string> =
  S extends `${infer Letter}${infer Rest}`
    ? Rest extends Uncapitalize<Rest>
      ? `${Uncapitalize<Letter>}${SnakeCase<Rest>}`
      : `${Uncapitalize<Letter>}_${SnakeCase<Rest>}`
    : S

export type SnakeCaseKeys<T> = {
  [K in keyof T as K extends string ? SnakeCase<K> : K]: T[K]
}
