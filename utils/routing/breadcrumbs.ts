import type { UserRole } from '@prisma/client'
import { Route, RoutePath, RouteTitle } from './'
import type { BeneficiaryNames } from '~/types/beneficiary'

type BeneficiaryNamesWithId = BeneficiaryNames & { id: string }

const OverviewBreadcrumb = () => [
  {
    text: RouteTitle.AppOverview(),
    to: RoutePath.AppOverview()
  }
]

const BeneficiariesBreadcrumb = () => [
  ...OverviewBreadcrumb(),
  {
    text: RouteTitle.AppBeneficiaries(),
    to: RoutePath.AppBeneficiaries()
  }
]

const HistoryBreadcrumb = () => [
  ...OverviewBreadcrumb(),
  {
    text: RouteTitle.AppHistory(),
    to: RoutePath.AppHistory()
  }
]

const BeneficiaryBreadcrumb = (
  beneficiary: BeneficiaryNamesWithId | null,
  originPage?:
    | Route.AppOverview
    | Route.AppBeneficiaries
    | Route.AppHistory
    | undefined
) => {
  const beneficiaryBreadcrumbSegment = {
    text: RouteTitle.AppBeneficiary(beneficiary),
    to: RoutePath.AppBeneficiary(beneficiary?.id, { originPage })
  }

  switch (originPage) {
    case Route.AppOverview:
      return [...OverviewBreadcrumb(), beneficiaryBreadcrumbSegment]
    case Route.AppHistory:
      return [...HistoryBreadcrumb(), beneficiaryBreadcrumbSegment]
    default:
      return [...BeneficiariesBreadcrumb(), beneficiaryBreadcrumbSegment]
  }
}

export const Breadcrumb = {
  [Route.AppAccount]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppAccount(), to: RoutePath.AppAccount() }
  ],

  [Route.AppHistory]: () => HistoryBreadcrumb(),

  [Route.AppOverview]: () => [...OverviewBreadcrumb()],

  [Route.AppStats]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppStats(), to: RoutePath.AppStats() }
  ],

  [Route.AppUsers]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppUsers(), to: RoutePath.AppUsers() }
  ],

  [Route.AppStructureEdit]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppStructureEdit(), to: RoutePath.AppStructureEdit() }
  ],

  [Route.AppBeneficiaries]: () => BeneficiariesBreadcrumb(),

  // FIXME: BeneficiariesAdd can be accessed from Overview, Beneficiaries and Stats
  [Route.AppBeneficiariesAdd]: () => [
    ...BeneficiariesBreadcrumb(),
    {
      text: RouteTitle.AppBeneficiariesAdd(),
      to: RoutePath.AppBeneficiariesAdd()
    }
  ],

  // FIXME: Beneficiary can be accessed from Overview, Beneficiaries, Stats and History
  [Route.AppBeneficiary]: (
    beneficiary: BeneficiaryNamesWithId | null,
    originPage?:
      | Route.AppOverview
      | Route.AppBeneficiaries
      | Route.AppHistory
      | undefined
  ) => BeneficiaryBreadcrumb(beneficiary, originPage),

  // FIXME: BeneficiaryEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryEdit]: (
    userRole: UserRole,
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryEdit(beneficiary),
      to: RoutePath.AppBeneficiaryEdit(userRole, beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryPrint depends on the access to Beneficiary
  [Route.AppBeneficiaryPrint]: (beneficiary: BeneficiaryNamesWithId | null) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryPrint(beneficiary),
      to: RoutePath.AppBeneficiaryPrint(beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryFollowupAdd depends on the access to Beneficiary
  [Route.AppBeneficiaryFollowupAdd]: (
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryFollowupAdd(beneficiary),
      to: RoutePath.AppBeneficiaryFollowupAdd(beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryFollowupEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryFollowupEdit]: (
    followup: { id: string; beneficiary: BeneficiaryNamesWithId } | null
  ) => [
    ...BeneficiaryBreadcrumb(followup?.beneficiary || null),
    {
      text: RouteTitle.AppBeneficiaryFollowupEdit(
        followup?.beneficiary || null
      ),
      to: RoutePath.AppBeneficiaryFollowupEdit(
        followup?.beneficiary.id || '',
        followup?.id || ''
      )
    }
  ],

  // FIXME: BeneficiaryHelpRequestAdd depends on the access to Beneficiary
  [Route.AppBeneficiaryHelpRequestAdd]: (
    beneficiary: BeneficiaryNamesWithId | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryHelpRequestAdd(beneficiary),
      to: RoutePath.AppBeneficiaryHelpRequestAdd(beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryHelpRequestEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryHelpRequestEdit]: (
    helpRequest: { id: string; beneficiary: BeneficiaryNamesWithId } | null
  ) => [
    ...BeneficiaryBreadcrumb(helpRequest?.beneficiary || null),
    {
      text: RouteTitle.AppBeneficiaryHelpRequestEdit(
        helpRequest?.beneficiary || null
      ),
      to: RoutePath.AppBeneficiaryHelpRequestEdit(
        helpRequest?.beneficiary.id || '',
        helpRequest?.id || ''
      )
    }
  ]
}
