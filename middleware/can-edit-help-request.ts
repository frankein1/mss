import { canEditHelpRequest } from '~/server/security/rules'
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  let allowed = false

  try {
    const helpRequest =
      await useTrpcClient().helpRequest.getHelpRequestDetails.query({
        id: to.params.iid as string
      })

    if (canEditHelpRequest(authStore.getAuthUser, helpRequest)) {
      allowed = true
    }
  } catch {
    allowed = false
  }

  if (!allowed) {
    return navigateTo(from)
  }
})
