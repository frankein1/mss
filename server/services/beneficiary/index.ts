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
  getDeleteDraftPermissions,
  getArchivePermissions
} from './permission.service'
import { getIdFromFamilyFileId } from './get-id-from-family-file-id.service'
import { createFamilyFileMember } from './create-family-file-member.service'
import { updateEntourage } from './update-entourage.service'
import { linkToFamilyFile } from './linkToFamilyFile.service'
import { addReferentToBeneficiaries } from './add-referent.service'
import { removeReferentFromBeneficiaries } from './remove-referent.service'

// TODO(foyer): SHOULD BE DELETED
export const BeneficiaryService = {
  create,
  get,
  getPage,
  updateTaxHousehold,
  exportWorkbook,
  exportBeneficiary,
  search,
  getSimilar,
  getDeleteDraftPermissions,
  getEditionPermissions,
  getArchivePermissions,
  getBeneficiarySecurityTarget,
  getIdFromFamilyFileId,
  createFamilyFileMember,
  updateEntourage,
  linkToFamilyFile,
  getBeneficiaryList,
  addReferentToBeneficiaries,
  removeReferentFromBeneficiaries
}

export type { BeneficiarySecurityTarget }
