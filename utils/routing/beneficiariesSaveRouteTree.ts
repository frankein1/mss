import { Route, AppBeneficiariesSaveRoute } from './routes'
import {
  canEditBeneficiaryRelatives,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security'

const beneficiariesSaveRouteAccessPermissions = {
  [Route.AppBeneficiariesSaveInfo]: null,
  [Route.AppBeneficiariesSaveTaxHousehold]: canEditBeneficiaryRelatives,
  [Route.AppBeneficiariesSaveEntourage]: canEditBeneficiaryRelatives,
  [Route.AppBeneficiariesSaveHealth]: canEditBeneficiaryHealthInfo,
  [Route.AppBeneficiariesSaveOccupation]: canEditBeneficiaryOccupationIncome,
  [Route.AppBeneficiariesSaveExternalOrganisations]:
    canEditBeneficiaryExternalOrganisations
}

const beneficiarySaveRouteTree: {
  [k in AppBeneficiariesSaveRoute]: {
    previous?: AppBeneficiariesSaveRoute
    next?: AppBeneficiariesSaveRoute
  }
} = {
  [Route.AppBeneficiariesSaveInfo]: {
    previous: undefined,
    next: Route.AppBeneficiariesSaveTaxHousehold
  },
  [Route.AppBeneficiariesSaveTaxHousehold]: {
    previous: Route.AppBeneficiariesSaveInfo,
    next: Route.AppBeneficiariesSaveEntourage
  },
  [Route.AppBeneficiariesSaveEntourage]: {
    previous: Route.AppBeneficiariesSaveTaxHousehold,
    next: Route.AppBeneficiariesSaveHealth
  },
  [Route.AppBeneficiariesSaveHealth]: {
    previous: Route.AppBeneficiariesSaveEntourage,
    next: Route.AppBeneficiariesSaveOccupation
  },
  [Route.AppBeneficiariesSaveOccupation]: {
    previous: Route.AppBeneficiariesSaveHealth,
    next: Route.AppBeneficiariesSaveExternalOrganisations
  },
  [Route.AppBeneficiariesSaveExternalOrganisations]: {
    previous: Route.AppBeneficiariesSaveOccupation,
    next: undefined
  }
}

function getBeneficiariesSaveRoutePrevious(
  route: AppBeneficiariesSaveRoute,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
): undefined | AppBeneficiariesSaveRoute {
  const { previous } = beneficiarySaveRouteTree[route]

  if (!previous) {
    return undefined
  }

  const accessRule = beneficiariesSaveRouteAccessPermissions[previous]

  if (!accessRule || accessRule(user, beneficiary)) {
    return previous
  }

  return getBeneficiariesSaveRoutePrevious(previous, user, beneficiary)
}

function getBeneficiariesSaveRouteNext(
  route: AppBeneficiariesSaveRoute,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
): undefined | AppBeneficiariesSaveRoute {
  const { next } = beneficiarySaveRouteTree[route]

  if (!next) {
    return undefined
  }

  const accessRule = beneficiariesSaveRouteAccessPermissions[next]

  if (!accessRule || accessRule(user, beneficiary)) {
    return next
  }

  return getBeneficiariesSaveRouteNext(next, user, beneficiary)
}

export function getBeneficiariesSaveRouteNavArrows(
  route: AppBeneficiariesSaveRoute,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
): {
  previous: AppBeneficiariesSaveRoute | undefined
  next: AppBeneficiariesSaveRoute | undefined
} {
  return {
    previous: getBeneficiariesSaveRoutePrevious(route, user, beneficiary),
    next: getBeneficiariesSaveRouteNext(route, user, beneficiary)
  }
}
