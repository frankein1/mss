import { getPageDocuments } from './getPageDocuments.service'
import { getMinimalInfo } from './getMinimalInfo.service'
import {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  FamilyFileSecurityTarget
} from './permission.service'
import { split } from './split.service'
import { getSocialSupportsSummary } from './get-social-supports-summary.service'

export const FamilyFileService = {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  getPageDocuments,
  getMinimalInfo,
  split,
  getSocialSupportsSummary
}

export type { FamilyFileSecurityTarget }
