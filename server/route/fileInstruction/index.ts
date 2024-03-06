import { getPage } from './getPage.query'
import { exportFileInstructions } from './export.query'
import { updateStatus } from './updateStatus.mutation'
import { getOngoing } from './getOngoing.query'

export const fileInstructionRoutes = {
  getPage,
  exportFileInstructions,
  updateStatus,
  getOngoing
}

export type {
  FileInstructionPageItem,
  FileInstructionPageItems,
  HelpRequestData
} from './getPage.query'
