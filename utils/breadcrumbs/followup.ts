import { breadcrumbs as ben } from './beneficiary'
import type { BeneficiaryIdentification } from '~/types/beneficiary'
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

interface FollowupEdit {
  id: string
  beneficiary: BeneficiaryIdentification
}

function getBreadForFollowupEdit(followup: FollowupEdit | null) {
  return [
    {
      text: r.AppBeneficiaryFollowupEdit.title(followup?.beneficiary || null),
      to: r.AppBeneficiaryFollowupEdit.path(
        followup?.beneficiary.id || '',
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
  ]
}
