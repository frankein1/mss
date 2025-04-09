import { AuthSession } from '~/server/types/session'
import { badrequest } from '~/utils/api/errors'

/** Manage logout for Proconnect when the login for
 * MonSuiviSocial has not succeeded */
export default defineEventHandler(async event => {
  const {
    auth: { sessionSecret }
  } = useRuntimeConfig()

  const session = await useSession<AuthSession>(event, {
    password: sessionSecret
  })

  const { logoutUrl } = session.data

  if (!logoutUrl) {
    await session.clear()
    throw badrequest('[Proconnect Logout] Unknown logout url')
  }

  await session.clear()

  sendRedirect(event, logoutUrl)
})
