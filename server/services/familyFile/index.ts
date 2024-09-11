import { getPageDocuments } from './getPageDocuments.service'
import { getMinimalInfo } from './getMinimalInfo.service'
import {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  FamilyFileSecurityTarget
} from './permission.service'
import { split } from './split.service'

export const FamilyFileService = {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  getPageDocuments,
  getMinimalInfo,
  split
}

export type { FamilyFileSecurityTarget }
