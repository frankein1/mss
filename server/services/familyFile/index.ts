import { getPageDocuments } from './getPageDocuments.service'
import { getMinimalInfo } from './getMinimalInfo.service'
import { getMembersAccommodation } from './get-members-accomodation.service'
import type { FamilyFileSecurityTarget } from './permission.service'
import {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget
} from './permission.service'
import { split } from './split.service'
import { addReferentToFamilyFile } from './add-referent.service'
import { deleteReferentFromFamilyfile } from './delete-referent.service'

export const FamilyFileService = {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  getPageDocuments,
  getMinimalInfo,
  getMembersAccommodation,
  split,
  addReferentToFamilyFile,
  deleteReferentFromFamilyfile
}

export type { FamilyFileSecurityTarget }
