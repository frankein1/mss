import { breadcrumbs as ben } from './beneficiary'
import { breadcrumbs as file } from './file'
import type {
  BeneficiaryIdentification,
  BeneficiaryNames
} from '~~/types/beneficiary'
import { routes } from '~/utils/routes'

const r = routes.followup

function getBreadForFollowupAdd(beneficiary: BeneficiaryIdentification | null) {
  return [
    {
      text: r.AppBeneficiaryFollowupAdd.title(beneficiary),
      to: r.AppBeneficiaryFollowupAdd.path(beneficiary?.id || '')
    }
  ]
}

function getBreadForFileFollowupAdd(familyFileId: string) {
  return [
    {
      text: r.AppBeneficiaryFollowupAdd.title(null),
      to: r.AppBeneficiaryFollowupAdd.path(familyFileId)
    }
  ]
}

function getBreadForFileFollowupEdit(familyFileId: string, followupId: string) {
  return [
    {
      text: r.AppBeneficiaryFollowupEdit.title(null),
      to: r.AppBeneficiaryFollowupEdit.path(familyFileId, followupId)
    }
  ]
}

interface FollowupEdit {
  id: string
  familyFileId: string
  beneficiary: BeneficiaryIdentification
}

function getBreadForFollowupEdit(followup: FollowupEdit | null) {
  return [
    {
      text: r.AppBeneficiaryFollowupEdit.title(null),
      to: r.AppBeneficiaryFollowupEdit.path(
        followup?.familyFileId || '',
        followup?.id || ''
      )
    }
  ]
}

export const breadcrumbs = {
  AppBeneficiaryFollowupAdd: (
    beneficiary: BeneficiaryIdentification | null
  ) => [
    ...ben.AppBeneficiary(beneficiary),
    ...getBreadForFollowupAdd(beneficiary)
  ],
  AppBeneficiaryFollowupEdit: (followup: FollowupEdit | null) => [
    ...ben.AppBeneficiary(followup?.beneficiary || null),
    ...getBreadForFollowupEdit(followup)
  ],
  AppFileFollowupAdd: (
    familyFileId: string,
    fileIdentification: BeneficiaryNames[] | null
  ) => [
    ...file.AppFile(familyFileId, fileIdentification),
    ...getBreadForFileFollowupAdd(familyFileId)
  ],
  AppFileFollowupEdit: (
    followup: FollowupEdit | null,
    fileIdentification: BeneficiaryNames[] | null
  ) => [
    ...file.AppFile(followup?.familyFileId || '', fileIdentification),
    ...getBreadForFileFollowupEdit(
      followup?.familyFileId || '',
      followup?.id || ''
    )
  ]
}
