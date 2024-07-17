import { breadcrumbs as user } from './user'
import type { BeneficiaryIdentification } from '~/types/beneficiary'
import { routes } from '~/routes'

const r = routes.beneficiary
type Routes = typeof r

function getBread<
  T extends 'AppBeneficiaries' | 'AppBeneficiariesAdd' | 'AppHistory'
>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

function getBreadWithBeneficiary<
  T extends 'AppBeneficiaryEdit' | 'AppBeneficiaryPrint'
>(name: T, beneficiary: BeneficiaryIdentification | null) {
  const title = r[name].title(beneficiary)
  return [{ text: title, to: r[name].path(beneficiary?.id || '') }]
}

function getBreadBeneficiary(beneficiary: BeneficiaryIdentification | null) {
  return [
    {
      text: r.AppBeneficiary.title(beneficiary),
      to: r.AppBeneficiary.path(beneficiary?.id || '')
    }
  ]
}

function getBreadBeneficiaryFromOriginPage(
  beneficiary: BeneficiaryIdentification | null,
  originPage?: 'AppOverview' | 'AppBeneficiaries' | 'AppHistory' | undefined
) {
  switch (originPage) {
    case 'AppOverview':
      return [...user.AppOverview(), ...getBreadBeneficiary(beneficiary)]
    case 'AppHistory':
      return [
        ...user.AppOverview(),
        ...getBread('AppHistory'),
        ...getBreadBeneficiary(beneficiary)
      ]
    default:
      return [
        ...user.AppOverview(),
        ...getBread('AppBeneficiaries'),
        ...getBreadBeneficiary(beneficiary)
      ]
  }
}

export const breadcrumbs = {
  AppBeneficiaries: () => [
    ...user.AppOverview(),
    ...getBread('AppBeneficiaries')
  ],
  AppBeneficiariesAdd: () => [
    ...user.AppOverview(),
    ...getBread('AppBeneficiariesAdd')
  ],
  AppBeneficiary: (
    beneficiary: BeneficiaryIdentification | null,
    originPage?: 'AppOverview' | 'AppBeneficiaries' | 'AppHistory' | undefined
  ) => getBreadBeneficiaryFromOriginPage(beneficiary, originPage),
  AppHistory: () => [...user.AppOverview(), ...getBread('AppHistory')],
  AppBeneficiaryEdit: (beneficiary: BeneficiaryIdentification | null) => [
    ...user.AppOverview(),
    ...getBreadBeneficiary(beneficiary),
    ...getBreadWithBeneficiary('AppBeneficiaryEdit', beneficiary)
  ],
  AppBeneficiaryPrint: (beneficiary: BeneficiaryIdentification | null) => [
    ...user.AppOverview(),
    ...getBreadBeneficiary(beneficiary),
    ...getBreadWithBeneficiary('AppBeneficiaryPrint', beneficiary)
  ]
}
