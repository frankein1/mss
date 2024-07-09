import {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  FamilyFileSecurityTarget
} from './permission.service'
import { getPageDocuments } from '../familyFile/getPageDocuments.service'

export const FamilyFileService = {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  getPageDocuments
}

export type { FamilyFileSecurityTarget }
