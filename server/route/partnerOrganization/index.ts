import { getAll } from './getAll.query'
import { getOne } from './getOne.query'
import { findBySiret } from './findBySiret.query'
import { update } from './update.mutation'
import { create } from './create.mutation'
import { remove } from './remove.mutation'

export const partnerRoutes = {
  create,
  update,
  getAll,
  getOne,
  findBySiret,
  remove
}
