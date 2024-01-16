import { create } from './create.service'
import { update } from './update.service'
import { get } from './get.service'
import { getPage, updatePageItem } from './page.service'
import { exportHelpRequests } from './export.service'
import {
  getEditionPermissions,
  getCreationPermissions
} from './permission.service'

export const HelpRequestService = {
  create,
  update,
  get,
  getPage,
  getEditionPermissions,
  getCreationPermissions,
  updatePageItem,
  exportHelpRequests
}
