import { FileInstructionType } from '@prisma/client'
import { BeneficiariesRoute } from './utils'
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
    path: (beneficiaryId: string, subject: FileInstructionType) =>
      `${BeneficiariesRoute}/${beneficiaryId}/help-requests/${subject.toLocaleLowerCase()}/add`
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
      beneficiaryId: string,
      helpRequestId: string,
      subject: FileInstructionType
    ) =>
      `${BeneficiariesRoute}/${beneficiaryId}/help-requests/${subject.toLocaleLowerCase()}/${helpRequestId}/edit`
  }
}
