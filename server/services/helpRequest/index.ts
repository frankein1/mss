import { create } from './create.service'
import { update } from './update.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { quickUpdate } from './quickUpdate.service'
import { exportHelpRequests } from './export.service'
import { getUpdatePermission, getCreatePermission } from './permission.service'

export const HelpRequestService = {
  create,
  update,
  get,
  getPage,
  getUpdatePermission,
  getCreatePermission,
  quickUpdate,
  exportHelpRequests
}
