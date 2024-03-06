import { create } from './create.mutation'
import { remove } from './delete.mutation'
import { getOne } from './getOne.query'
import { update } from './update.mutation'

export const helpRequestRoutes = {
  create,
  remove,
  getOne,
  update
}
