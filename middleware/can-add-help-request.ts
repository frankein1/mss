import { useAuthStore } from '~/store/auth'
import { canCreateHelpRequest } from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getAuthUser: user } = useAuthStore()

  let allowed = false

  try {
    const beneficiary = await getBeneficiarySecurityTarget(
      to.params.id as string
    )

    if (beneficiary && canCreateHelpRequest(user, beneficiary)) {
      allowed = true
    }
  } catch {
    allowed = false
  }

  if (!allowed) {
    return navigateTo(from)
  }
})
