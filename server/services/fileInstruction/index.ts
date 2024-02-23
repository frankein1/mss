import { getPage } from './getPage.service'
import { exportFileInstructions } from './export.service'
import { updateStatus } from './updateStatus.service'
import { getOngoing } from './getOngoing.service'

export const FileInstructionService = {
  getPage,
  exportFileInstructions,
  updateStatus,
  getOngoing
}
