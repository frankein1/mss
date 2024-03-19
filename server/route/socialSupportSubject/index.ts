import { update } from './update.mutation'
import { get } from './getOne.query'
import { makeInactive } from './makeInactive.mutation'

export const socialSupportSubjectRoutes = {
  get,
  update,
  makeInactive
}
