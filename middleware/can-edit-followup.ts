import { canEditFollowup } from '~/server/security'
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  let allowed = false

  try {
    const followup = await useTrpcClient().followup.getFollowupDetails.query({
      id: to.params.fid as string
    })

    if (canEditFollowup(authStore.getAuthUser, followup)) {
      allowed = true
    }
  } catch {
    allowed = false
  }

  if (!allowed) {
    return navigateTo(from)
  }
})
