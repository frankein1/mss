import { Route, RoutePath, RouteTitle } from './'
import type { BeneficiaryNames } from '~/types/beneficiary'

type BeneficiaryNamesWithId = BeneficiaryNames & { id: string }

const OverviewBreadcrumb = (isLast = true) => [
  {
    text: RouteTitle.Overview(),
    to: isLast ? undefined : RoutePath.Overview()
  }
]

const BeneficiariesBreadcrumb = (isLast = true) => [
  {
    text: RouteTitle.Beneficiaries(),
    to: isLast ? undefined : RoutePath.Beneficiaries()
  }
]

const HistoryBreadcrumb = (isLast = true) => [
  { text: RouteTitle.History(), to: isLast ? undefined : RoutePath.History() }
]

const BeneficiaryBreadcrumb = (
  isLast = true,
  beneficiary: BeneficiaryNamesWithId | null,
  originPage?: Route.Overview | Route.Beneficiaries | Route.History | undefined
) => {
  const beneficiaryBreadcrumbSegment = {
    text: RouteTitle.Beneficiary(beneficiary),
    to: isLast
      ? undefined
      : RoutePath.Beneficiary(beneficiary?.id, { originPage })
  }

  switch (originPage) {
    case Route.Overview:
      return [...OverviewBreadcrumb(false), beneficiaryBreadcrumbSegment]
    case Route.History:
      return [...HistoryBreadcrumb(false), beneficiaryBreadcrumbSegment]
    default:
      return [...BeneficiariesBreadcrumb(false), beneficiaryBreadcrumbSegment]
  }
}

export const Breadcrumb = {
  [Route.Account]: () => [{ text: RouteTitle.Account() }],

  [Route.History]: () => HistoryBreadcrumb(),

  [Route.Overview]: () => OverviewBreadcrumb(),

  [Route.Stats]: () => [{ text: RouteTitle.Stats() }],

  [Route.Users]: () => [{ text: RouteTitle.Users() }],

  [Route.StructureEdit]: () => [{ text: RouteTitle.StructureEdit() }],

  [Route.Beneficiaries]: () => BeneficiariesBreadcrumb(),

  // FIXME: BeneficiariesAdd can be accessed from Overview, Beneficiaries and Stats
  [Route.BeneficiariesAdd]: () => [
    ...BeneficiariesBreadcrumb(false),
    { text: RouteTitle.BeneficiariesAdd() }
  ],

  // FIXME: Beneficiary can be accessed from Overview, Beneficiaries, Stats and History
  [Route.Beneficiary]: (
    beneficiary: BeneficiaryNamesWithId | null,
    originPage?:
      | Route.Overview
      | Route.Beneficiaries
      | Route.History
      | undefined
  ) => BeneficiaryBreadcrumb(true, beneficiary, originPage),

  // FIXME: BeneficiaryEdit depends on the access to Beneficiary
  [Route.BeneficiaryEdit]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.BeneficiaryEdit(beneficiary || null) }
  ],

  // FIXME: BeneficiaryPrint depends on the access to Beneficiary
  [Route.BeneficiaryPrint]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.BeneficiaryPrint() }
  ],

  // FIXME: BeneficiaryFollowupAdd depends on the access to Beneficiary
  [Route.BeneficiaryFollowupAdd]: (
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary),
    { text: RouteTitle.BeneficiaryFollowupAdd(beneficiary) }
  ],

  // FIXME: BeneficiaryFollowupEdit depends on the access to Beneficiary
  [Route.BeneficiaryFollowupEdit]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.BeneficiaryFollowupEdit(beneficiary || null) }
  ],

  // FIXME: BeneficiaryHelpRequestAdd depends on the access to Beneficiary
  [Route.BeneficiaryHelpRequestAdd]: (
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary),
    { text: RouteTitle.BeneficiaryHelpRequestAdd(beneficiary) }
  ],

  // FIXME: BeneficiaryHelpRequestEdit depends on the access to Beneficiary
  [Route.BeneficiaryHelpRequestEdit]: (
    beneficiary: BeneficiaryNamesWithId | null | undefined
  ) => [
    ...BeneficiaryBreadcrumb(false, beneficiary || null),
    { text: RouteTitle.BeneficiaryHelpRequestEdit(beneficiary || null) }
  ]
}
