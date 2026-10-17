import { countSupportProgramNameUsage } from './countNameUsage.service'
import {
  deleteUnusedExitReasons,
  pruneOrphanedExitReasons,
  resolveExitReasonIds
} from './exitReason.service'

export const SupportProgramService = {
  countSupportProgramNameUsage,
  resolveExitReasonIds,
  pruneOrphanedExitReasons,
  deleteUnusedExitReasons
}
