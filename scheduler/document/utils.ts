import { ofetch } from 'ofetch'
import { SCHEDULER_ENV } from '../env'

const SCALINGO_AUTH_URL = 'https://auth.scalingo.com'
const SCALINGO_API_URL = `https://${SCHEDULER_ENV.scalingo.region}.scalingo.com`

async function scalingoApiLogin() {
  const res = await ofetch<{ token: string }>(
    `${SCALINGO_AUTH_URL}/v1/tokens/exchange`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SCHEDULER_ENV.scalingo.apiToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  // Token is valid for 1 hour
  return { token: res.token, expiresAt: new Date(Date.now() + 3600 * 1000) }
}

export async function scalingoRun(command: string) {
  if (SCHEDULER_ENV.public.mssEnvironment === 'local') {
    throw new Error(
      'This command cannot be launched locally, consider using directly the terminal'
    )
  }
  if (!SCHEDULER_ENV.scalingo.apiToken || !SCHEDULER_ENV.scalingo.appName) {
    throw new Error('scheduler-document: missing Scalingo configuration')
  }

  const authed = await scalingoApiLogin()

  const res = await ofetch<{ operation_url: string }>(
    `${SCALINGO_API_URL}/v1/apps/${SCHEDULER_ENV.scalingo.appName}/run`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authed.token}`,
        'Content-Type': 'application/json'
      },
      body: { command, detached: true }
    }
  )

  console.log(
    `scheduler-document: scalingo one-off container has been launched and operation is viewable at ${res.operation_url}`
  )
}
