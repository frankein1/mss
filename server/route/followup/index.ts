import { create } from './create.mutation'
import { getPage } from './getPage.query'
import { getExport } from './getExport.query'
import { getOne } from './getOne.query'
import { remove } from './remove.mutation'
import { update } from './update.mutation'
import { getOngoing } from './getOngoing.query'

export const followupRoutes = {
  create,
  getPage,
  getExport,
  getOne,
  remove,
  update,
  getOngoing
}

export type { FollowupPageItems, FollowupPageItem } from './getPage.query'
