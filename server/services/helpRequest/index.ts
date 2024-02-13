import { create } from './create.service'
import { update } from './update.service'
import { get } from './get.service'
import { quickUpdate } from './quickUpdate.service'
import {
  getEditionPermissions,
  getCreationPermissions
} from './permission.service'

export const HelpRequestService = {
  create,
  update,
  get,
  getEditionPermissions,
  getCreationPermissions,
  quickUpdate
}
