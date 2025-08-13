import { createAttendee } from './create-attendee.mutation'
import { createWorkshop } from './create.mutation'
import { getPageQuery } from './getPage.query'
import { getQuery } from './get.query'
import { getWorkshopNameList } from './getWorkshopNameList'
import { deleteWorkshop } from './deleteWorkshop.mutation'
import { updateWorkshop } from './update.mutation'
import { updateAttendeeAttendance } from './update-attendee-attendance.mutation'
import { deleteAttendee } from './delete-attendee.mutation'
import { getExportedAttendance } from './getExportedAttendance.query'

export const workshopRoutes = {
  createWorkshop,
  getWorkshopNameList,
  getPageQuery,
  getQuery,
  deleteWorkshop,
  updateWorkshop,
  createAttendee,
  deleteAttendee,
  updateAttendeeAttendance,
  getExportedAttendance
}
