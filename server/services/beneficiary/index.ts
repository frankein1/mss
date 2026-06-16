import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import getBeneficiaryList from './getBeneficiaryList.service'

import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportWorkbook } from './export-all.service'
import { exportBeneficiary } from './exportBeneficiary.service'
import { search } from './search.service'
import { getSimilar } from './getSimilar.service'
import type { BeneficiarySecurityTarget } from './permission.service'
import {
  getBeneficiarySecurityTarget,
  getEditionPermissions,
  getArchivePermissions
} from './permission.service'
import { getIdFromFamilyFileId } from './get-id-from-family-file-id.service'
import { createFamilyFileMember } from './create-family-file-member.service'
import { updateEntourage } from './update-entourage.service'
import { linkToFamilyFile } from './linkToFamilyFile.service'

export const BeneficiaryService = {
  create,
  get,
  getPage,
  updateTaxHousehold,
  exportWorkbook,
  exportBeneficiary,
  search,
  getSimilar,
  getEditionPermissions,
  getArchivePermissions,
  getBeneficiarySecurityTarget,
  getIdFromFamilyFileId,
  createFamilyFileMember,
  updateEntourage,
  linkToFamilyFile,
  getBeneficiaryList
}

export type { BeneficiarySecurityTarget }
