import { getPage } from './getPage.query'
import { exportFileInstructions } from './export.query'
import { getOngoing } from './getOngoing.query'

export const fileInstructionRoutes = {
  getPage,
  exportFileInstructions,
  getOngoing
}

export type {
  FileInstructionPageItem,
  FileInstructionPageItems
} from './getPage.query'
