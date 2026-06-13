import {
  getEditionPermissions,
  getCreationPermissions
} from './permission.service'
import {
  deleteBeneficiaryS3Files,
  deleteStructureS3Files
} from './s3-cleanup.service'

export const DocumentService = {
  getEditionPermissions,
  getCreationPermissions,
  deleteBeneficiaryS3Files,
  deleteStructureS3Files
}
