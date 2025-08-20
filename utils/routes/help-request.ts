import type { FileInstructionType } from '@prisma/client'
import { FilesRoute, getRouteOptions } from './utils'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import type { BeneficiaryNames } from '~/types/beneficiary'
import { fileInstructionTypeFilterKeys } from '~/client/options'

export interface HelpRequestAddRouteOptions {
  beneficiaryId?: string
}

export const routes = {
  AppBeneficiaryHelpRequestAdd: {
    name: 'AppBeneficiaryHelpRequestAdd',
    title: (
      beneficiary: BeneficiaryNames | null,
      subject?: FileInstructionType
    ) =>
      beneficiary
        ? `Instruction d'un dossier ${subject ? '(' + fileInstructionTypeFilterKeys.byKey[subject] + ')' : ''} pour ${formatBeneficiaryDisplayName(
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
    title: (
      beneficiary: BeneficiaryNames | null,
      subject?: FileInstructionType
    ) =>
      beneficiary
        ? `Modifier l'instruction de dossier ${subject ? '(' + fileInstructionTypeFilterKeys.byKey[subject] + ')' : ''} ${formatBeneficiaryDisplayName(
            beneficiary
          )}`
        : "Modifier l'instruction de dossier d'une personne bénéficiaire",
    path: (
      familyFileId: string,
      helpRequestId: string,
      subject: FileInstructionType
    ) =>
      `${FilesRoute}/${familyFileId}/help-requests/${subject.toLocaleLowerCase()}/${helpRequestId}/edit`
  }
} as const
