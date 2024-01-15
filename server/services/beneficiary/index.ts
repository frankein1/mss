import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { getPageDocuments } from './getPageDocuments.service'
import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportBeneficiaries } from './export.service'
import { search } from './search.service'
import {
  getCreatePermission,
  getEditionPermission,
  getBeneficiarySecurityTarget,
  BeneficiarySecurityTarget
} from './permission.service'

export const BeneficiaryService = {
  create,
  getCreatePermission,
  getEditionPermission,
  get,
  getPage,
  getPageDocuments,
  updateTaxHousehold,
  exportBeneficiaries,
  search,
  getBeneficiarySecurityTarget
}

export type { BeneficiarySecurityTarget }
