import type { ProtectedAppContext } from '~~/server/trpc'
import { getAgentAuthInfo, getAgentClient } from './helper'

export default async function getAuthStatus({
  ctx
}: {
  ctx: ProtectedAppContext
}) {
  if (!ctx.structure.externalRdvspActive) {
    return 'module_not_active'
  }
  try {
    await getAgentAuthInfo(ctx.user.id)
  } catch {
    return 'no_account'
  }
  try {
    const agentClient = getAgentClient({ user_id: ctx.user.id })
    const data = await agentClient('/agents/me', {
      method: 'GET'
    })

    if (data.agent.id !== undefined) {
      return 'connected'
    }
  } catch {
    return 'disconnected'
  }
  return 'disconnected'
}
