import { create } from './create.mutation'
import { remove } from './delete.mutation'
import { getOne } from './getOne.query'
import { quickUpdate } from './quickUpdate.mutation'
import { update } from './update.mutation'

export const helpRequestRoutes = {
  create,
  remove,
  getOne,
  quickUpdate,
  update
}
