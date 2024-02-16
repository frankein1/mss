import { getAll } from './getAll.query'
import { getOne } from './getOne.query'
import { update } from './update.mutation'
import { create } from './create.mutation'

export const partnerRoutes = {
  create,
  update,
  getAll,
  getOne
}
