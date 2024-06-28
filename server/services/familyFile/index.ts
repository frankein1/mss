import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { getPageDocuments } from './getPageDocuments.service'
import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportBeneficiaries } from './export.service'
import { search } from './search.service'
import {
  getCreationPermissions,
  getEditionPermissions,
  getBeneficiarySecurityTarget,
  BeneficiarySecurityTarget
} from '../familyFile/permission.service'
import { getSimilar } from './getSimilar.service'
import { createHouseholdMember } from './create-household-member.service'

export const BeneficiaryService = {
  create,
  createHouseholdMember,
  getCreationPermissions,
  getEditionPermissions,
  get,
  getPage,
  getPageDocuments,
  updateTaxHousehold,
  exportBeneficiaries,
  search,
  getBeneficiarySecurityTarget,
  getSimilar
}

export type { BeneficiarySecurityTarget }
