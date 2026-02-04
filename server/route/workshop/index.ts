import { createBeneficiaryAttendee } from './create-beneficiary-attendee.mutation'
import { createExternalAttendee } from './create-external-attendee.mutation'
import { createWorkshop } from './create.mutation'
import { getPageQuery } from './getPage.query'
import { getQuery } from './get.query'
import { getWorkshopNameList } from './get-workshop-name-list.query'
import { deleteWorkshop } from './deleteWorkshop.mutation'
import { updateWorkshop } from './update.mutation'
import { updateAttendeeAttendance } from './update-attendee-attendance.mutation'
import { deleteAttendee } from './delete-attendee.mutation'
import { getExportedAttendance } from './getExportedAttendance.query'
import { updateAttendeeListType } from './update-attendee-list-type.mutation'
import { exportWorkshops } from './export.query'
import { updateAttendee } from './update-attendee.mutation'

export const workshopRoutes = {
  createWorkshop,
  getWorkshopNameList,
  getPageQuery,
  getQuery,
  deleteWorkshop,
  updateWorkshop,
  createBeneficiaryAttendee,
  createExternalAttendee,
  deleteAttendee,
  updateAttendeeAttendance,
  getExportedAttendance,
  updateAttendeeListType,
  exportWorkshops,
  updateAttendee
}
