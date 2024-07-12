import { getPageDocuments } from '../familyFile/getPageDocuments.service'
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
  getPageDocuments
}

export type { FamilyFileSecurityTarget }
