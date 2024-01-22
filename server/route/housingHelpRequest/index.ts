import { create } from './create.mutation'
import { getOne } from './getOne.query'
import { update } from './update.mutation'

export const housingHelpRequestRoutes = {
  create,
  getOne,
  update
}

export type { GetHousingHelpRequestOutput } from './getOne.query'
