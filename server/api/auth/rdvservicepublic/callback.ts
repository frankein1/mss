import { useSession } from 'h3'
import { AuthSession } from '~/server/types/session'
import * as client from '~/server/lib/rdvsp-oauth.client'
import { prismaClient } from '~/server/prisma'
import { cleanEmail } from '~/utils/user'
import { routes } from '~/utils/routes'

const { auth } = useRuntimeConfig()

const unauthorized = (message: string) =>
  createError({ statusCode: 401, message })
// const forbidden = (message: string) => createError({ statusCode: 403, message })
const badrequest = (message: string) =>
  createError({ statusCode: 400, message })

export default defineEventHandler(async event => {
  const { code, state } = getQuery(event)
  const cfg = client.getConfig()

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

  const token = await client.getToken(cfg, code as string)

  console.log(token)
  if ('error' in token || !token) {
    throw badrequest('Could not retrieve authentication token')
  }

  // nonce verification could be implemented here

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

  // if structure integration is not active, fetch rdvsp organisation, activate structure and store rdvsp organisation id in structure

  if (!user) {
    throw badrequest('Could not retrieve user info')
  }

  const getProvider = (agent: any) =>
    agent.inclusion_connect_open_id_sub ? 'ProConnect' : 'Email'

  const account = await prismaClient.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: getProvider(agent),
        providerAccountId: agent.id.toString()
      }
    },
    select: { id: true, user: true }
  })

  if (!account) {
    await Promise.all([
      prismaClient.account.create({
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
        // activate rdvsp integration with externalRdvspActive
        data: {}
      })
    ])
  } else {
    prismaClient.account.update({
      where: { id: account.id },
      data: {
        accessToken: token.access_token,
        expiresAt: token.expires_in,
        scope: token.scope,
        sessionState: state
      }
    })
  }

  // On redirigera vers la page de prise de rdv de rdvsp
  return sendRedirect(event, routes.user.AppOverview.path())
})
