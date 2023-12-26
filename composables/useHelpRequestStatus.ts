import {
  helpRequestStatusLabels,
  ministryHelpRequestStatusLabels
} from '~/client/options/helpRequest'
import { labelsToOptions } from '~/utils/options'

export function useHelpRequestStatus() {
  const isMinistryAgent = useAuthState().isMinistryAgent()

  const statusLabels = computed(() =>
    isMinistryAgent ? ministryHelpRequestStatusLabels : helpRequestStatusLabels
  )
  const statusOptions = computed(() => labelsToOptions(statusLabels.value))

  return {
    helpRequestStatusLabels: statusLabels,
    helpRequestStatusOptions: statusOptions
  }
}
