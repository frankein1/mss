import { useSession } from 'h3'
import { RdvspAuthSession } from '~/server/types/session'
import * as client from '~/server/lib/rdvsp-oauth.client'
import { prismaClient } from '~/server/prisma'
import { routes } from '~/utils/routes'
import { JwtUser } from '~/types/user'
import { checkUserIsAuthenticated } from '~/utils/api/checkUserIsAuthenticated'
import { unauthorized, badrequest } from '~/utils/api/errors'

import { logger } from '~/server/plugins/logger'

const { auth } = useRuntimeConfig()

/** RDVSP Oauth callback endpoint
 * Register rdvsp auth token in database and redirect to page
 * which will handle the action to be performed after signin
 */
export default defineEventHandler(async event => {
  logger.verbose('in rdvsp callback for auth')
  const { code, state } = getQuery(event)

  if (!code || !state) {
    throw unauthorized('No code or state returned from RDVSP OAuth')
  }

  const { user }: { user: JwtUser } = event.context.auth

  checkUserIsAuthenticated(user)

  const session = await useSession<RdvspAuthSession>(event, {
    password: auth.sessionSecret
  })

  try {
    await createOrUpdateToken(
      code as string,
      state as string,
      session,
      user.id,
      user.structureId as string
    )
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
  session: { data: RdvspAuthSession },
  userId: string,
  structureId: string
) {
  const { nonce: sessionNonce, state: sessionState } = session.data

  if (!sessionNonce || !sessionState || sessionState !== state) {
    throw unauthorized('Missing or invalid state or nonce')
  }

  const cfg = client.getConfig()
  const token = await client.getToken(cfg, code as string)

  if ('error' in token || !token) {
    throw badrequest('Could not retrieve authentication token')
  }

  // FIXME nonce verification could be implemented here

  const agent = await client.getAgentInfo(cfg, token.access_token)
  logger.verbose(`rdvsp: connected as ${agent.first_name} ${agent.last_name}`)

  if ('error' in agent || !agent) {
    throw badrequest('Could not retrieve agent info')
  }

  const structure = await prismaClient.structure.findUnique({
    where: { id: structureId },
    select: { externalRdvspActive: true, externalRdvspId: true }
  })

  if (!structure?.externalRdvspActive) {
    throw unauthorized('Rdvsp integration not active for this structure')
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
    logger.verbose('create account')

    if (!structure.externalRdvspId) {
      await importRdvspOrganisationId(structureId, token.access_token)
    }

    await Promise.all([
      prismaClient.externalAccount.create({
        data: {
          user: { connect: { id: userId } },
          type: 'rdvsp',
          provider: getProvider(agent),
          providerAccountId: agent.id.toString(),
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: token.expires_in,
          scope: token.scope,
          sessionState: state
        }
      }),
      prismaClient.user.update({
        where: { id: userId },
        data: {
          externalRdvspId: agent.id.toString()
        }
      })
    ])
  } else {
    logger.verbose('update account', account.id)
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

/** The first time a structure manager signs in to rdvsp, the organizationId
 * is retrieved to link MSS structure and RDVSP organization
 */
async function importRdvspOrganisationId(
  structureId: string,
  accessToken: string
) {
  logger.verbose('import organization')
  const cfg = client.getConfig()

  const org = await client.getOrganisation(cfg, accessToken)

  if ('error' in org || !org) {
    throw badrequest('Could not retrieve agent organization')
  }

  await prismaClient.structure.update({
    where: { id: structureId },
    data: { externalRdvspId: org.id.toString() }
  })
}
