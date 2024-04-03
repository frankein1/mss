import { FileInstructionType } from '@prisma/client'
import { Route, RoutePath } from './routes'
import { RouteTitle } from './titles'
import type {
  BeneficiaryIdentification,
  BeneficiaryNames
} from '~/types/beneficiary'

const beneficiaryNamesWithIdToBeneficiaryNames = (
  beneficiary: BeneficiaryNames | null
) => {
  if (!beneficiary) {
    return null
  }

  return beneficiary
}

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
  beneficiary: BeneficiaryIdentification | null,
  originPage?:
    | Route.AppOverview
    | Route.AppBeneficiaries
    | Route.AppHistory
    | undefined
) => {
  const beneficiaryBreadcrumbSegment = {
    text: RouteTitle.AppBeneficiary(
      beneficiaryNamesWithIdToBeneficiaryNames(beneficiary)
    ),
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

  [Route.AppPartners]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppPartners(), to: RoutePath.AppPartners() }
  ],

  [Route.AppStructure]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppStructure(), to: RoutePath.AppStructure() }
  ],

  [Route.AppStructureEdit]: () => [
    ...OverviewBreadcrumb(),
    { text: RouteTitle.AppStructureEdit(), to: RoutePath.AppStructureEdit() }
  ],

  [Route.AppStructureSubjects]: () => [
    ...OverviewBreadcrumb(),
    {
      text: RouteTitle.AppStructureSubjects(),
      to: RoutePath.AppStructureSubjects()
    }
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
    beneficiary: BeneficiaryIdentification | null,
    originPage?:
      | Route.AppOverview
      | Route.AppBeneficiaries
      | Route.AppHistory
      | undefined
  ) => BeneficiaryBreadcrumb(beneficiary, originPage),

  // FIXME: BeneficiaryBudgetInfo depends on the access to Beneficiary
  [Route.AppBeneficiaryBudgetInfoEdit]: (
    beneficiary: BeneficiaryIdentification | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryBudgetInfoEdit(),
      to: RoutePath.AppBeneficiaryBudgetInfoEdit(beneficiary?.id || '')
    }
  ],

  // FIXME: AppBeneficiaryBudgetExpensesEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryBudgetExpensesEdit]: (
    beneficiary: BeneficiaryIdentification | null,
    expensesId: string
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryBudgetExpensesEdit(),
      to: RoutePath.AppBeneficiaryBudgetExpensesEdit(
        beneficiary?.id || '',
        expensesId
      )
    }
  ],

  // FIXME: BeneficiaryEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryEdit]: (
    beneficiary: BeneficiaryIdentification | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryEdit(
        beneficiaryNamesWithIdToBeneficiaryNames(beneficiary)
      ),
      to: RoutePath.AppBeneficiaryEditInfo(beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryPrint depends on the access to Beneficiary
  [Route.AppBeneficiaryPrint]: (
    beneficiary: BeneficiaryIdentification | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryPrint(
        beneficiaryNamesWithIdToBeneficiaryNames(beneficiary)
      ),
      to: RoutePath.AppBeneficiaryPrint(beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryFollowupAdd depends on the access to Beneficiary
  [Route.AppBeneficiaryFollowupAdd]: (
    beneficiary: BeneficiaryIdentification | null
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryFollowupAdd(
        beneficiaryNamesWithIdToBeneficiaryNames(beneficiary)
      ),
      to: RoutePath.AppBeneficiaryFollowupAdd(beneficiary?.id || '')
    }
  ],

  // FIXME: BeneficiaryFollowupEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryFollowupEdit]: (
    followup: { id: string; beneficiary: BeneficiaryIdentification } | null
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
    beneficiary: BeneficiaryIdentification | null,
    subject: FileInstructionType
  ) => [
    ...BeneficiaryBreadcrumb(beneficiary),
    {
      text: RouteTitle.AppBeneficiaryHelpRequestAdd(
        beneficiaryNamesWithIdToBeneficiaryNames(beneficiary)
      ),
      to: RoutePath.AppBeneficiaryHelpRequestAdd(beneficiary?.id || '', subject)
    }
  ],

  // FIXME: BeneficiaryHelpRequestEdit depends on the access to Beneficiary
  [Route.AppBeneficiaryHelpRequestEdit]: (
    helpRequest: { id: string; beneficiary: BeneficiaryIdentification } | null,
    subject: FileInstructionType
  ) => [
    ...BeneficiaryBreadcrumb(helpRequest?.beneficiary || null),
    {
      text: RouteTitle.AppBeneficiaryHelpRequestEdit(
        helpRequest?.beneficiary || null
      ),
      to: RoutePath.AppBeneficiaryHelpRequestEdit(
        helpRequest?.beneficiary.id || '',
        helpRequest?.id || '',
        subject
      )
    }
  ]
}
