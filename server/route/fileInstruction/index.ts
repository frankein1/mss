import { getPage } from './getPage.query'
import { exportFileInstructions } from './export.query'
import { updateStatus } from './updateStatus.mutation'

export const fileInstructionRoutes = {
  getPage,
  exportFileInstructions,
  updateStatus
}
