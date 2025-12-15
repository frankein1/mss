import { deleteDocument } from './delete.service'
import {
  getEditionPermissions,
  getCreationPermissions
} from './permission.service'

export const DocumentService = {
  getEditionPermissions,
  getCreationPermissions,
  deleteDocument
}
