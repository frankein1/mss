import { useSession } from 'h3'
import { RdvspAuthSession } from '~/server/types/session'
import * as client from '~/server/lib/rdvsp-oauth.client'
import { prismaClient } from '~/server/prisma'
import { cleanEmail } from '~/utils/user'
import { routes } from '~/utils/routes'

const { auth } = useRuntimeConfig()

const unauthorized = (message: string) =>
  createError({ statusCode: 401, message })

const badrequest = (message: string) =>
  createError({ statusCode: 400, message })

/** RDVSP Oauth callback endpoint
 * Register rdvsp auth token in database and redirect to page
 * which will handle the action to be performed after signin
 */
export default defineEventHandler(async event => {
  console.log('in rdvsp callback for auth')
  const { code, state } = getQuery(event)

  if (!code || !state) {
    throw unauthorized('No code or state returned from RDVSP OAuth')
  }
  console.log('code', code)
  console.log('state', state)

  const session = await useSession<RdvspAuthSession>(event, {
    password: auth.sessionSecret
  })

  try {
    await createOrUpdateToken(code as string, state as string, session)
  } catch (e) {
    await session.clear()
    throw e
  }

  // After successful signin, perform intended action through browser
  const options = {
    action: session.data.metadata.action,
    id: session.data.metadata.id
  }
  const redirect = `${routes.rdvsp.AppRdvspAfterSignIn.path(options)}`

  await session.clear()
  return sendRedirect(event, redirect || routes.user.AppOverview.path())
})

/** Update external_account table with RDVSP auth token for the user */
async function createOrUpdateToken(
  code: string,
  state: string,
  session: { data: RdvspAuthSession }
) {
  const { nonce: sessionNonce, state: sessionState } = session.data

  if (!sessionNonce || !sessionState || sessionState !== state) {
    throw unauthorized('Missing or invalid state or nonce')
  }

  const cfg = client.getConfig()
  const token = await client.getToken(cfg, code as string)

  console.log(token)
  if ('error' in token || !token) {
    throw badrequest('Could not retrieve authentication token')
  }

  // FIXME nonce verification could be implemented here

  const agent = await client.getAgentInfo(cfg, token.access_token)
  console.log(agent)

  if ('error' in agent || !agent) {
    throw badrequest('Could not retrieve agent info')
  }

  // add verification of MSS user (in session ?)
  const user = await prismaClient.user.findUnique({
    where: { email: cleanEmail(agent.email) },
    // add structure and user externalRdvspActive
    select: {
      id: true,
      structure: { select: { id: true } }
    }
  })

  // TODO if structure integration is not active
  // sol 1: activate it: fetch rdvsp organisation, activate structure and store rdvsp organisation id in structure
  // sol 2: throw. Structure activation would then be done manually through back office

  if (!user) {
    throw badrequest('Could not retrieve user info')
  }

  const getProvider = (agent: any) =>
    agent.inclusion_connect_open_id_sub ? 'ProConnect' : 'Email'

  const account = await prismaClient.externalAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: getProvider(agent),
        providerAccountId: agent.id.toString()
      }
    },
    select: {
      id: true,
      user: { select: { id: true } }
    }
  })

  if (!account) {
    console.log('create account')
    await Promise.all([
      prismaClient.externalAccount.create({
        data: {
          user: { connect: { id: user.id } },
          type: 'rdvsp',
          provider: getProvider(agent),
          providerAccountId: agent.id.toString(),
          accessToken: token.access_token,
          expiresAt: token.expires_in,
          scope: token.scope,
          sessionState: state
        }
      }),
      prismaClient.user.update({
        where: { id: user.id },
        data: {
          externalRdvspId: agent.id.toString()
        }
      })
    ])
  } else {
    console.log('update account', account.id)
    await prismaClient.externalAccount.update({
      where: { id: account.id },
      data: {
        accessToken: token.access_token,
        expiresAt: token.expires_in,
        scope: token.scope,
        sessionState: state
      }
    })
  }
}
