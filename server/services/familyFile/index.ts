import { getPageDocuments } from './getPageDocuments.service'
import { getMinimalInfo } from './getMinimalInfo.service'
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
  split,
  addReferentToFamilyFile,
  deleteReferentFromFamilyfile
}

export type { FamilyFileSecurityTarget }
