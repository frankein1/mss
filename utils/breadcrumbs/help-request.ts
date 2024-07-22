import { FileInstructionType } from '@prisma/client'
import { breadcrumbs as ben } from './beneficiary'
import type { BeneficiaryIdentification } from '~/types/beneficiary'
import { routes } from '~/utils/routes'

const r = routes.helpRequest

function getBreadForHelpRequestAdd(
  beneficiary: BeneficiaryIdentification | null,
  subject: FileInstructionType
) {
  return [
    {
      text: r.AppBeneficiaryHelpRequestAdd.title(beneficiary),
      to: r.AppBeneficiaryHelpRequestAdd.path(beneficiary?.id || '', subject)
    }
  ]
}

interface HelpRequestEdit {
  id: string
  beneficiary: BeneficiaryIdentification
}

function getBreadForHelpRequestEdit(
  helpRequest: HelpRequestEdit | null,
  subject: FileInstructionType
) {
  return [
    {
      text: r.AppBeneficiaryHelpRequestEdit.title(
        helpRequest?.beneficiary || null
      ),
      to: r.AppBeneficiaryHelpRequestEdit.path(
        helpRequest?.beneficiary.id || '',
        helpRequest?.id || '',
        subject
      )
    }
  ]
}

export const breadcrumbs = {
  AppBeneficiaryFollowupAdd: (
    beneficiary: BeneficiaryIdentification | null,
    subject: FileInstructionType
  ) => [
    ...ben.AppBeneficiary(beneficiary),
    ...getBreadForHelpRequestAdd(beneficiary, subject)
  ],
  AppBeneficiaryFollowupEdit: (
    helpRequest: HelpRequestEdit | null,
    subject: FileInstructionType
  ) => [
    ...ben.AppBeneficiary(helpRequest?.beneficiary || null),
    ...getBreadForHelpRequestEdit(helpRequest, subject)
  ]
}
