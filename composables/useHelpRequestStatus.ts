import {
  helpRequestStatusLabels,
  ministryHelpRequestStatusLabels
} from '~/client/options/helpRequest'
import { labelsToOptions } from '~/utils/options'

export function useHelpRequestStatus() {
  const isMinistryAgent = useMinistryAgent()

  const statusLabels = computed(() =>
    isMinistryAgent.value
      ? helpRequestStatusLabels
      : ministryHelpRequestStatusLabels
  )
  const statusOptions = computed(() => labelsToOptions(statusLabels.value))

  return {
    helpRequestStatusLabels: statusLabels,
    helpRequestStatusOptions: statusOptions
  }
}
