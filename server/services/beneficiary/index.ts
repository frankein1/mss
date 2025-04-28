import { create } from './create.service'
import { get } from './get.service'
import { getPage } from './getPage.service'

import { updateTaxHousehold } from './updateTaxHousehold.service'
import { exportAll } from './export-all.service'
import { exportBeneficiary } from './exportBeneficiary.service'
import { search } from './search.service'
import { getSimilar } from './getSimilar.service'
import {
  getBeneficiarySecurityTarget,
  getEditionPermissions,
  getDeleteDraftPermissions,
  BeneficiarySecurityTarget,
  getArchivePermissions
} from './permission.service'
import { getIdFromFamilyFileId } from './get-id-from-family-file-id.service'
import { createFamilyFileMember } from './create-family-file-member.service'
import { updateEntourage } from './update-entourage.service'
import {
  getArchiveDate,
  getBeneficiaryLastActivity,
  getLastActivity
} from './get-last-activity.service'
import { linkToFamilyFile } from './linkToFamilyFile.service'

// TODO(foyer): SHOULD BE DELETED
export const BeneficiaryService = {
  create,
  get,
  getPage,
  updateTaxHousehold,
  exportAll,
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
  getLastActivity,
  getArchiveDate,
  getBeneficiaryLastActivity,
  linkToFamilyFile
}

export type { BeneficiarySecurityTarget }
