import { breadcrumbs as user } from './user'
import type {
  BeneficiaryIdentification,
  BeneficiaryNames
} from '~/types/beneficiary'
import { routes } from '~/utils/routes'
import { getBreadFamilyFile } from './file'

const r = routes.beneficiary
type Routes = typeof r

function getBread<
  T extends
    | 'AppBeneficiaries'
    | 'AppBeneficiariesAdd'
    | 'AppBeneficiariesReferentTransfer'
>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

export function getBreadWithBeneficiary<
  T extends
    | 'AppBeneficiaryEdit'
    | 'AppBeneficiaryPrint'
    | 'AppBeneficiaryArchive'
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
      return [...user.AppOverview(), ...getBreadBeneficiary(beneficiary)]
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
  AppBeneficiariesReferentTransfer: () => [
    ...user.AppOverview(),
    ...getBread('AppBeneficiaries'),
    ...getBread('AppBeneficiariesReferentTransfer')
  ],
  AppBeneficiariesAdd: () => [
    ...user.AppOverview(),
    ...getBread('AppBeneficiariesAdd')
  ],
  AppBeneficiary: (
    beneficiary: BeneficiaryIdentification | null,
    originPage?: 'AppOverview' | 'AppBeneficiaries' | 'AppHistory' | undefined
  ) => getBreadBeneficiaryFromOriginPage(beneficiary, originPage),
  AppBeneficiaryEdit: (beneficiary: BeneficiaryIdentification | null) => [
    ...user.AppOverview(),
    ...getBreadBeneficiary(beneficiary),
    ...getBreadWithBeneficiary('AppBeneficiaryEdit', beneficiary)
  ],
  AppBeneficiaryPrint: (beneficiary: BeneficiaryIdentification | null) => [
    ...user.AppOverview(),
    ...getBreadBeneficiary(beneficiary),
    ...getBreadWithBeneficiary('AppBeneficiaryPrint', beneficiary)
  ],
  AppBeneficiaryArchive: (
    beneficiary: BeneficiaryIdentification | null,
    familyFileId: string,
    familyIdentification: BeneficiaryNames[] | null
  ) => [
    ...user.AppOverview(),
    ...getBread('AppBeneficiaries'),
    ...getBreadFamilyFile(
      familyFileId,
      familyIdentification,
      beneficiary ? { beneficiaryId: beneficiary.id } : undefined
    ),
    ...getBreadWithBeneficiary('AppBeneficiaryArchive', beneficiary)
  ]
}
