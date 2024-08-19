import { breadcrumbs as ben, getBreadWithBeneficiary } from './beneficiary'
import { breadcrumbs as user } from './user'
import { routes } from '~/utils/routes'
import {
  BeneficiaryNames,
  BeneficiaryIdentification
} from '~/types/beneficiary'
import { FamilyFileUrlOptions } from '~/utils/routes/file'

const r = routes.file
type Routes = typeof r

type OriginPage = 'AppOverview' | 'AppBeneficiaries' | 'AppHistory'

interface FamilyFileBreadcrumbOptions {
  originPage?: OriginPage
}

function getBread<T extends 'AppHistory' | 'AppFileAdd'>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

function getBreadFamilyFile(
  familyFileId: string,
  familyIdentification: BeneficiaryNames[] | null,
  options?: FamilyFileUrlOptions
) {
  const paragraph = shortParagraph(r.AppFile.title(familyIdentification))

  return [
    {
      text: paragraph,
      to: r.AppFile.path(familyFileId || '', options)
    }
  ]
}

const _b = {
  AppFileAdd: () => [...user.AppOverview(), ...getBread('AppFileAdd')],
  AppFileBeneficiaryEdit: (
    familyFileId: string,
    familyIdentification: BeneficiaryNames[] | null,
    beneficiary: BeneficiaryIdentification | null
  ) => [
    ...ben.AppBeneficiaries(),
    ...getBreadFamilyFile(
      familyFileId,
      familyIdentification,
      beneficiary ? { beneficiaryId: beneficiary.id } : undefined
    ),
    ...getBreadWithBeneficiary('AppBeneficiaryEdit', beneficiary)
  ],
  AppHistory: () => [...user.AppOverview(), ...getBread('AppHistory')]
}

function getBreadFamilyFileFromOriginPage(
  familyFileId: string,
  familyIdentification: BeneficiaryNames[] | null,
  options?: FamilyFileBreadcrumbOptions
) {
  switch (options?.originPage) {
    case 'AppOverview':
      return [
        ...user.AppOverview(),
        ...getBreadFamilyFile(familyFileId, familyIdentification)
      ]
    case 'AppHistory':
      return [
        ..._b.AppHistory(),
        ...getBreadFamilyFile(familyFileId, familyIdentification)
      ]
    case 'AppBeneficiaries':
    default:
      return [
        ...ben.AppBeneficiaries(),
        ...getBreadFamilyFile(familyFileId, familyIdentification)
      ]
  }
}

export const breadcrumbs = {
  AppFile: getBreadFamilyFileFromOriginPage,
  AppFileAdd: _b.AppFileAdd,
  AppFileBeneficiaryEdit: _b.AppFileBeneficiaryEdit,
  AppHistory: _b.AppHistory
}

const shortParagraph = (initialParagraph: string, value: number = 5) => {
  const words = initialParagraph.split(' ', value)
  return words.length < 5 ? initialParagraph : words.join(' ') + '...'
}
