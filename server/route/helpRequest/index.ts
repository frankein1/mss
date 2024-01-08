import { create } from './create.mutation'
import { remove } from './delete.mutation'
import { exportHelpRequests } from './export.query'
import { getOne } from './getOne.query'
import { getPage } from './getPage.query'
import { quickUpdate } from './quickUpdate.mutation'
import { update } from './update.mutation'

export const helpRequestRoutes = {
  create,
  remove,
  exportHelpRequests,
  getOne,
  getPage,
  quickUpdate,
  update
}
