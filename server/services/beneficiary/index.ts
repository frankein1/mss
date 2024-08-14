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
import { createHostedEntourageMember } from './create-hosted-entourage-member.service'
import { getIdFromFamilyFileId } from './get-id-from-family-file-id.service'
import { createFamilyFileMember } from './create-family-file-member.service'

// TODO(foyer): SHOULD BE DELETED
export const BeneficiaryService = {
  create,
  createHostedEntourageMember,
  get,
  getPage,
  updateTaxHousehold,
  exportBeneficiaries,
  search,
  getSimilar,
  getEditionPermissions,
  getBeneficiarySecurityTarget,
  getIdFromFamilyFileId,
  createFamilyFileMember
}

export type { BeneficiarySecurityTarget }
