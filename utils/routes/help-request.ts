import { FileInstructionType } from '@prisma/client'
import { FilesRoute, getRouteOptions } from './utils'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export interface HelpRequestAddRouteOptions {
  beneficiaryId?: string
}

export const routes = {
  AppBeneficiaryHelpRequestAdd: {
    name: 'AppBeneficiaryHelpRequestAdd',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Instruction d'un dossier pour ${formatBeneficiaryDisplayName(
            beneficiary
          )}`
        : "Instruction d'un dossier",
    path: (
      familyFileId: string,
      subject: FileInstructionType,
      options?: HelpRequestAddRouteOptions
    ) =>
      `${FilesRoute}/${familyFileId}/help-requests/${subject.toLocaleLowerCase()}/add${getRouteOptions(options)}`
  },
  AppBeneficiaryHelpRequestEdit: {
    name: 'AppBeneficiaryHelpRequestEdit',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Modifier l'instruction de dossier ${formatBeneficiaryDisplayName(
            beneficiary
          )}`
        : "Modifier l'instruction de dossier d'un·e bénéficiaire",
    path: (
      familyFileId: string,
      helpRequestId: string,
      subject: FileInstructionType
    ) =>
      `${FilesRoute}/${familyFileId}/help-requests/${subject.toLocaleLowerCase()}/${helpRequestId}/edit`
  }
} as const
