import { FilesRoute } from './utils'
import { BeneficiaryTab } from '~/utils/constants/beneficiary'
import { HistoryTab } from '~/utils/constants/history'
import { BeneficiaryNames } from '~/types/beneficiary'
import { formatFamilyFileName } from '~/utils/familyFile/formatFamilyFileName'

type OriginPage =
  | 'AppOverview'
  | 'AppBeneficiaries'
  | 'AppHistory'
  | 'AppFileBudgetInfoEdit'
  | 'AppBeneficiaryBudgetIncomeEdit'
  | 'AppFileBudgetExpensesEdit'

// TODO rename item to something clearer
interface FamilyFileUrlOptions {
  beneficiaryId?: string
  tab?: BeneficiaryTab

  item?: string
  originPage?: OriginPage
  originTab?: HistoryTab
}

function createSuffixUrl(options?: FamilyFileUrlOptions) {
  const hasDefinedOptions = options && Object.values(options).every(o => !!o)

  if (hasDefinedOptions) {
    const { tab, ...params } = options
    const tabHash = tab ? `#${tab}` : ''

    if (Object.keys(params).length) {
      const urlParams = new URLSearchParams(params)
      return `?${urlParams}${tabHash}`
    }

    return tabHash
  }

  return ''
}

function getFamilyFileRoute(
  familyFileId: string | undefined,
  options?: FamilyFileUrlOptions
) {
  if (!familyFileId) {
    return ''
  }

  const base = `${FilesRoute}/${familyFileId}`
  const suffix = createSuffixUrl(options)

  return `${base}${suffix}`
}

export const routes = {
  AppFile: {
    name: 'AppFile',
    title: (fileIdentification: BeneficiaryNames[] | null) =>
      fileIdentification ? formatFamilyFileName(fileIdentification) : '',
    path: getFamilyFileRoute
  }
} as const
