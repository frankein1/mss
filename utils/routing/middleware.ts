import { RoutePath } from './'
import { useAuthStore } from '~/store/auth'
import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityRuleGrantee
} from '~/server/security/rules'

function getBeneficiaryFormFallbackRoute(
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

export async function beneficiaryFormSectionMiddleware(
  beneficiaryId: string | undefined,
  toPath: string,
  fromPath: string,
  securityRule: (
    grantee: SecurityRuleGrantee,
    beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  ) => boolean
) {
  const { getAuthUser: user } = useAuthStore()

  const fallbackRoute = getBeneficiaryFormFallbackRoute(
    toPath,
    fromPath,
    beneficiaryId
  )

  if (!beneficiaryId) {
    if (
      !securityRule(user, {
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

      if (!securityRule(user, beneficiary)) {
        return navigateTo(fallbackRoute)
      }
    } catch {
      return navigateTo(fallbackRoute)
    }
  }
}
