import { FileInstructionType } from '@prisma/client'
import { breadcrumbs as ben } from './beneficiary'
import { breadcrumbs as file } from './file'
import type { BeneficiaryIdentification } from '~/types/beneficiary'
import { routes } from '~/utils/routes'
import { BeneficiaryNames } from '~/types/beneficiary'

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

function getBreadForFileHelpRequestAdd(
  familyFileId: string,
  subject: FileInstructionType
) {
  return [
    {
      text: r.AppBeneficiaryHelpRequestAdd.title(null),
      to: r.AppBeneficiaryHelpRequestAdd.path(familyFileId, subject)
    }
  ]
}

interface HelpRequestEdit {
  id: string
  familyFileId: string
  beneficiary: BeneficiaryIdentification
}

function getBreadForHelpRequestEdit(
  helpRequest: HelpRequestEdit | null,
  subject: FileInstructionType
) {
  return [
    {
      text: r.AppBeneficiaryHelpRequestEdit.title(null),
      to: r.AppBeneficiaryHelpRequestEdit.path(
        helpRequest?.familyFileId || '',
        helpRequest?.id || '',
        subject
      )
    }
  ]
}

export const breadcrumbs = {
  AppBeneficiaryHelpRequestAdd: (
    beneficiary: BeneficiaryIdentification | null,
    subject: FileInstructionType
  ) => [
    ...ben.AppBeneficiary(beneficiary),
    ...getBreadForHelpRequestAdd(beneficiary, subject)
  ],
  AppBeneficiaryHelpRequestEdit: (
    helpRequest: HelpRequestEdit | null,
    subject: FileInstructionType
  ) => [
    ...ben.AppBeneficiary(helpRequest?.beneficiary || null),
    ...getBreadForHelpRequestEdit(helpRequest, subject)
  ],
  AppFileHelpRequestAdd: (
    familyFileId: string,
    fileIdentification: BeneficiaryNames[] | null,
    subject: FileInstructionType
  ) => [
    ...file.AppFile(familyFileId, fileIdentification),
    ...getBreadForFileHelpRequestAdd(familyFileId, subject)
  ],
  AppFileHelpRequestEdit: (
    helpRequest: HelpRequestEdit | null,
    fileIdentification: BeneficiaryNames[] | null,
    subject: FileInstructionType
  ) => [
    ...file.AppFile(helpRequest?.familyFileId || '', fileIdentification),
    ...getBreadForHelpRequestEdit(helpRequest, subject)
  ]
}
