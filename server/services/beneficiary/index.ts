import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { getPageDocuments } from './getPageDocuments.service'
import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportBeneficiaries } from './export.service'
import { search } from './search.service'
import { getSimilar } from './getSimilar.service'
import {
  getEditionPermissions,
  BeneficiarySecurityTarget
} from './permission.service'
import { createHouseholdMember } from './create-household-member.service'

export const BeneficiaryService = {
  create,
  createHouseholdMember,
  get,
  getPage,
  getPageDocuments,
  updateTaxHousehold,
  exportBeneficiaries,
  search,
  getSimilar,
  getEditionPermissions
}

export type { BeneficiarySecurityTarget }
