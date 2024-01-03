import { create } from './create.mutation'
import { getPage } from './getPage.query'
import { getExport } from './getExport.query'
import { getOne } from './getOne.query'
import { quickUpdate } from './quickUpdate.mutation'
import { remove } from './remove.mutation'
import { update } from './update.mutation'

export const followupRoutes = {
  create,
  getPage,
  getExport,
  getOne,
  quickUpdate,
  remove,
  update
}
