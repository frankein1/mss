import { AppRoute, FilesRoute, getRouteOptions } from './utils'
import type { BeneficiaryTab } from '~/utils/constants/beneficiary'
import type { BeneficiaryNames } from '~/types/beneficiary'
import { formatFamilyFileName } from '~/utils/familyFile/formatFamilyFileName'
import type { TypeSuivi } from '~/client/options'
import type {
  FilterFileInstructionNotFilled,
  FilterFollowupNotFilled
} from '../constants/filters'

type OriginPage =
  | 'AppOverview'
  | 'AppBeneficiaries'
  | 'AppHistory'
  | 'AppFileBudgetInfoEdit'
  | 'AppFileBudgetIncomeEdit'
  | 'AppFileBudgetExpensesEdit'
  | 'ExternalRdvsp'

// TODO rename item to something clearer
export interface FamilyFileUrlOptions {
  beneficiaryId?: string
  tab?: BeneficiaryTab

  item?: string
  originPage?: OriginPage
  originTab?: string
}

function getFamilyFileRoute(
  familyFileId: string | undefined,
  options?: FamilyFileUrlOptions
) {
  if (!familyFileId) {
    return ''
  }

  const base = `${FilesRoute}/${familyFileId}`
  const suffix = getRouteOptions(options)

  return `${base}${suffix}`
}

export const routes = {
  AppFile: {
    name: 'AppFile',
    title: (fileIdentification: BeneficiaryNames[] | null) =>
      fileIdentification ? formatFamilyFileName(fileIdentification) : '',
    path: getFamilyFileRoute
  },
  AppFileAdd: {
    name: 'AppFileAdd',
    title: 'Créer un dossier',
    path: () => `${FilesRoute}/add`
  },
  AppHistory: {
    name: 'AppHistory',
    title: 'Accompagnements',
    path: () => `${AppRoute}/history`
  },
  AppHistoryFollowups: {
    name: 'AppHistoryFollowups',
    title: 'Entretiens',
    path: (options?: { notFilled?: FilterFollowupNotFilled }) => {
      const notFilled = options?.notFilled
        ? `?not-filled=${options.notFilled}`
        : ''
      return `${AppRoute}/history/followups${notFilled}`
    }
  },
  AppHistoryFileInstructions: {
    name: 'AppHistoryFileInstructions',
    title: "Dossiers d'instruction",
    path: (options?: { notFilled?: FilterFileInstructionNotFilled }) => {
      const notFilled = options?.notFilled
        ? `?not-filled=${options.notFilled}`
        : ''
      return `${AppRoute}/history/file-instructions${notFilled}`
    }
  },
  AppHistoryPrint: {
    name: 'AppHistoryPrint',
    title: 'Imprimer la fiche',
    path: (historyId: string, type?: TypeSuivi) => {
      let routeUrl = `${AppRoute}/historyprint/${historyId}/print`
      if (type) {
        routeUrl = routeUrl + `?type=${type}`
      }
      return routeUrl
    }
  }
} as const
