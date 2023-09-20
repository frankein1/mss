import { useAuthStore } from '~/store/auth'
import { RoutePath } from '~/utils/routing/routes'
import { canEditBeneficiaryRelatives } from '~/server/security/rules'

function getFallbackRoute(
  toPath: string,
  fromPath: string,
  beneficiaryId: string | undefined
) {
  if (toPath.match(/^\/app\/beneficiaries\/save\/[a-z-]+$/)) {
    if (toPath !== fromPath) {
      return fromPath
    }
    return RoutePath.AppBeneficiaries()
  }
  if (toPath.match(/^\/app\/beneficiaries\/[a-z0-9-]+\/edit\/[a-z-]+$/)) {
    if (toPath !== fromPath) {
      return fromPath
    }
    return RoutePath.AppBeneficiary(beneficiaryId)
  }
  return RoutePath.AppBeneficiaries()
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getAuthUser: user } = useAuthStore()

  const beneficiaryId = to.params.id as string | undefined

  const fallbackRoute = getFallbackRoute(to.path, from.path, beneficiaryId)

  if (!beneficiaryId) {
    if (
      !canEditBeneficiaryRelatives(user, {
        referents: [{ id: user.id }],
        structureId: user.structureId
      })
    ) {
      return navigateTo(fallbackRoute)
    }
  } else {
    try {
      const beneficiary =
        await useTrpcClient().beneficiary.getBeneficiarySecurityTarget.query({
          id: beneficiaryId
        })

      if (!canEditBeneficiaryRelatives(user, beneficiary)) {
        return navigateTo(fallbackRoute)
      }
    } catch {
      return navigateTo(fallbackRoute)
    }
  }
})
