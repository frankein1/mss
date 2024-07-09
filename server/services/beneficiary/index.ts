import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'

import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportBeneficiaries } from './export.service'
import { search } from './search.service'
import { getSimilar } from './getSimilar.service'
import {
  getBeneficiarySecurityTarget,
  getEditionPermissions,
  BeneficiarySecurityTarget
} from './permission.service'
import { createHouseholdMember } from './create-household-member.service'

export const BeneficiaryService = {
  create,
  createHouseholdMember,
  get,
  getPage,
  updateTaxHousehold,
  exportBeneficiaries,
  search,
  getSimilar,
  getEditionPermissions,
  getBeneficiarySecurityTarget
}

export type { BeneficiarySecurityTarget }
