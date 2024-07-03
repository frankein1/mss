import {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget,
  FamilyFileSecurityTarget
} from './permission.service'

export const FamilyFileService = {
  getCreationPermissions,
  getEditionPermissions,
  getFamilyFileSecurityTarget
}

export type { FamilyFileSecurityTarget }
