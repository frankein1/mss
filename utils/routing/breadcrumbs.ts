import { Route, RoutePath, RouteTitle } from './'
import type { BeneficiaryNames } from '~/types/beneficiary'

type BeneficiaryNamesWithId = BeneficiaryNames & { id: string }

const OverviewBreadcrumb = {
  text: RouteTitle.AppOverview(),
  to: RoutePath.AppOverview()
}

const BeneficiariesBreadcrumb = (isLast = true) => [
  OverviewBreadcrumb,
  {
    text: RouteTitle.AppBeneficiaries(),
    to: isLast ? undefined : RoutePath.AppBeneficiaries()
  }
]

const HistoryBreadcrumb = (isLast = true) => [
  OverviewBreadcrumb,
  {
    text: RouteTitle.AppHistory(),
    to: isLast ? undefined : RoutePath.AppHistory()
  }
]

const BeneficiaryBreadcrumb = (
  isLast = true,
  beneficiary: BeneficiaryNamesWithId | null,
  originPage?:
    | Route.AppOverview
    | Route.AppBeneficiaries
    | Route.AppHistory
    | undefined
) => {
  const beneficiaryBreadcrumbSegment = {
    text: RouteTitle.AppBeneficiary(beneficiary),
    to: isLast
      ? undefined
      : RoutePath.AppBeneficiary(beneficiary?.id, { originPage })
  }

  switch (originPage) {
    case Route.AppOverview:
      return [OverviewBreadcrumb, beneficiaryBreadcrumbSegment]
    case Route.AppHistory:
      return [...HistoryBreadcrumb(false), beneficiaryBreadcrumbSegment]
    default:
      return [...BeneficiariesBreadcrumb(false), beneficiaryBreadcrumbSegment]
  }
}

export const Breadcrumb = {
  [Route.AppAccount]: () => [
    OverviewBreadcrumb,
    { text: RouteTitle.AppAccount() }
  ],

  [Route.AppHistory]: () => HistoryBreadcrumb(),

  [Route.AppOverview]: () => [OverviewBreadcrumb],

  [Route.AppStats]: () => [OverviewBreadcrumb, { text: RouteTitle.AppStats() }],

  [Route.AppUsers]: () => [OverviewBreadcrumb, { text: RouteTitle.AppUsers() }],

  [Route.AppStructureEdit]: () => [
    OverviewBreadcrumb,
    { text: RouteTitle.AppStructureEdit() }
  ],

  [Route.AppBeneficiaries]: () => BeneficiariesBreadcrumb(),

  // FIXME: BeneficiariesAdd can be accessed from Overview, Beneficiaries and Stats
  [Route.AppBeneficiariesAdd]: () => [
    ...BeneficiariesBreadcrumb(false),
    { text: RouteTitle.AppBeneficiariesAdd() }
  ],

  // FIXME: Beneficiary can be accessed from Overview, Beneficiaries, Stats and History
  [Route.AppBeneficiary]: (
    beneficiary: BeneficiaryNamesWithId | null,
    originPage?:
      | Route.AppOverview
      | Route.AppBeneficiaries
      | Route.AppHistory
      | undefined
  ) => BeneficiaryBreadcrumb(true, beneficiary, originPage),

  // FIXME: BeneficiaryEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryEdit]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.AppBeneficiaryEdit(beneficiary || null) }
  ],

  // FIXME: BeneficiaryPrint depends on the access to Beneficiary
  [Route.AppBeneficiaryPrint]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.AppBeneficiaryPrint() }
  ],

  // FIXME: BeneficiaryFollowupAdd depends on the access to Beneficiary
  [Route.AppBeneficiaryFollowupAdd]: (
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary),
    { text: RouteTitle.AppBeneficiaryFollowupAdd(beneficiary) }
  ],

  // FIXME: BeneficiaryFollowupEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryFollowupEdit]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.AppBeneficiaryFollowupEdit(beneficiary || null) }
  ],

  // FIXME: BeneficiaryHelpRequestAdd depends on the access to Beneficiary
  [Route.AppBeneficiaryHelpRequestAdd]: (
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary),
    { text: RouteTitle.AppBeneficiaryHelpRequestAdd(beneficiary) }
  ],

  // FIXME: BeneficiaryHelpRequestEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryHelpRequestEdit]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.AppBeneficiaryHelpRequestEdit(beneficiary || null) }
  ]
}
