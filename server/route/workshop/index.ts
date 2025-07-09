import { createWorkshop } from './create.mutation'
import { getPageQuery } from './getPage.query'
import { getQuery } from './get.query'
import { getWorkshopNameList } from './getWorkshopNameList'
import { deleteWorkshop } from './deleteWorkshop.mutation'

export const workshopRoutes = {
  createWorkshop,
  getWorkshopNameList,
  getPageQuery,
  getQuery,
  deleteWorkshop
}
