import { getPageDocuments } from './getPageDocuments.service'
import { getMinimalInfo } from './getMinimalInfo.service'
import {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  FamilyFileSecurityTarget
} from './permission.service'

export const FamilyFileService = {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  getPageDocuments,
  getMinimalInfo
}

export type { FamilyFileSecurityTarget }
