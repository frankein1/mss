import { useSession } from 'h3'
import { AuthSession } from '~/server/types/session'
import { getConfig, getToken } from '~/server/lib/rdvsp-oauth.client'

const { auth } = useRuntimeConfig()

const unauthorized = (message: string) =>
  createError({ statusCode: 401, message })
const forbidden = (message: string) => createError({ statusCode: 403, message })
const badrequest = (message: string) =>
  createError({ statusCode: 400, message })

export default defineEventHandler(async event => {
  const { code, state } = getQuery(event)

  if (!code || !state) {
    throw unauthorized('No code or state returned from RDVSP OAuth')
  }
  console.log('code', code)
  console.log('state', state)

  const session = await useSession<AuthSession>(event, {
    password: auth.sessionSecret
  })

  const { nonce: sessionNonce, state: sessionState } = session.data

  if (!sessionNonce || !sessionState || sessionState !== state) {
    throw unauthorized('Missing or invalid state or nonce')
  }

  const response = await getToken(getConfig(), code as string)

  if ('error' in response || !response.data) {
    throw badrequest('Could not retrieve authentication token')
  }

  console.log('token', response.data)

  // const payload = decode(re)
})
