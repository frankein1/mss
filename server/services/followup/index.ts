import { update } from './update.service'
import { create } from './create.service'
import { get } from './get.service'
import { exportFollowups } from './export.service'
import { getUpdatePermission, getCreatePermission } from './permission.service'

export const FollowupService = {
  update,
  create,
  get,
  exportFollowups,
  getUpdatePermission,
  getCreatePermission,
}

