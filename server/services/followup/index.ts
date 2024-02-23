import { update } from './update.service'
import { create } from './create.service'
import { remove } from './remove.service'
import { get } from './get.service'
import { getPage } from './getPage.service'
import { exportFollowups } from './export.service'
import {
  getEditionPermissions,
  getCreationPermissions
} from './permission.service'
import { getOngoing } from './getOngoing.service'

export const FollowupService = {
  update,
  create,
  remove,
  get,
  getPage,
  exportFollowups,
  getEditionPermissions,
  getCreationPermissions,
  getOngoing
}
