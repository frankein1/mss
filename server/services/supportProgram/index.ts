import { countSupportProgramNameUsage } from './countNameUsage.service'
import {
  deleteUnusedExitReasons,
  resolveExitReasonIds
} from './exitReason.service'

export const SupportProgramService = {
  countSupportProgramNameUsage,
  resolveExitReasonIds,
  deleteUnusedExitReasons
}
