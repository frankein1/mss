import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'

export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore()
  if (!authStore.isReferent) {
    return
  }

  try {
    const isBeneficiaryReferent =
      await useTrpcClient().beneficiary.isBeneficiaryReferent.query({
        id: to.params.id as string
      })

    if (!isBeneficiaryReferent) {
      return navigateTo(RoutePath.AppBeneficiaries())
    }
  } catch {
    return navigateTo(RoutePath.AppBeneficiaries())
  }
})
