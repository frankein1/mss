import { update } from './update.service'
import { create } from './create.service'
import { remove } from './remove.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { exportFollowups } from './export.service'
import { getUpdatePermission, getCreatePermission } from './permission.service'

export const FollowupService = {
  update,
  create,
  remove,
  get,
  getPage,
  exportFollowups,
  getUpdatePermission,
  getCreatePermission
}
