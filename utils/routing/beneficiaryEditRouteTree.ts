import { Route, AppBeneficiaryEditRoute } from './routes'
import {
  canEditBeneficiaryRelatives,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryGeneral,
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security'

const beneficiaryEditRouteAccessPermissions = {
  [Route.AppBeneficiaryEditInfo]: canEditBeneficiaryGeneral,
  [Route.AppBeneficiaryEditTaxHousehold]: canEditBeneficiaryRelatives,
  [Route.AppBeneficiaryEditEntourage]: canEditBeneficiaryRelatives,
  [Route.AppBeneficiaryEditHealth]: canEditBeneficiaryHealthInfo,
  [Route.AppBeneficiaryEditOccupation]: canEditBeneficiaryOccupationIncome,
  [Route.AppBeneficiaryEditExternalOrganisations]:
    canEditBeneficiaryExternalOrganisations
}

const beneficiaryEditRouteTree: {
  [k in AppBeneficiaryEditRoute]: {
    previous?: AppBeneficiaryEditRoute
    next?: AppBeneficiaryEditRoute
  }
} = {
  [Route.AppBeneficiaryEditInfo]: {
    previous: undefined,
    next: Route.AppBeneficiaryEditTaxHousehold
  },
  [Route.AppBeneficiaryEditTaxHousehold]: {
    previous: Route.AppBeneficiaryEditInfo,
    next: Route.AppBeneficiaryEditEntourage
  },
  [Route.AppBeneficiaryEditEntourage]: {
    previous: Route.AppBeneficiaryEditTaxHousehold,
    next: Route.AppBeneficiaryEditHealth
  },
  [Route.AppBeneficiaryEditHealth]: {
    previous: Route.AppBeneficiaryEditEntourage,
    next: Route.AppBeneficiaryEditOccupation
  },
  [Route.AppBeneficiaryEditOccupation]: {
    previous: Route.AppBeneficiaryEditHealth,
    next: Route.AppBeneficiaryEditExternalOrganisations
  },
  [Route.AppBeneficiaryEditExternalOrganisations]: {
    previous: Route.AppBeneficiaryEditOccupation,
    next: undefined
  }
}

function getBeneficiaryEditRoutePrevious(
  route: AppBeneficiaryEditRoute,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
): undefined | AppBeneficiaryEditRoute {
  const { previous } = beneficiaryEditRouteTree[route]

  if (!previous) {
    return undefined
  }

  const accessRule = beneficiaryEditRouteAccessPermissions[previous]

  if (accessRule(user, beneficiary)) {
    return previous
  }

  return getBeneficiaryEditRoutePrevious(previous, user, beneficiary)
}

function getBeneficiaryEditRouteNext(
  route: AppBeneficiaryEditRoute,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
): undefined | AppBeneficiaryEditRoute {
  const { next } = beneficiaryEditRouteTree[route]

  if (!next) {
    return undefined
  }

  const accessRule = beneficiaryEditRouteAccessPermissions[next]

  if (accessRule(user, beneficiary)) {
    return next
  }

  return getBeneficiaryEditRouteNext(next, user, beneficiary)
}

export function getBeneficiaryEditRouteNavArrows(
  route: AppBeneficiaryEditRoute,
  user: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
): {
  previous: AppBeneficiaryEditRoute | undefined
  next: AppBeneficiaryEditRoute | undefined
} {
  return {
    previous: getBeneficiaryEditRoutePrevious(route, user, beneficiary),
    next: getBeneficiaryEditRouteNext(route, user, beneficiary)
  }
}
