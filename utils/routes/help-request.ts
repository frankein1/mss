import { FileInstructionType } from '@prisma/client'
import { FilesRoute } from './utils'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export const routes = {
  AppBeneficiaryHelpRequestAdd: {
    name: 'AppBeneficiaryHelpRequestAdd',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Instruction d'un dossier pour ${formatBeneficiaryDisplayName(
            beneficiary
          )}`
        : "Instruction d'un dossier",
    path: (familyFileId: string, subject: FileInstructionType) =>
      `${FilesRoute}/${familyFileId}/help-requests/${subject.toLocaleLowerCase()}/add`
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
