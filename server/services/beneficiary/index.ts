import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { getPageDocuments } from './getPageDocuments.service'
import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportBeneficiaries } from './export.service'
import { search } from './search.service'
import { getCreatePermission, getUpdatePermission } from './permission.service'

export const BeneficiaryService = {
  create,
  getCreatePermission,
  getUpdatePermission,
  get,
  getPage,
  getPageDocuments,
  updateTaxHousehold,
  exportBeneficiaries,
  search
}

