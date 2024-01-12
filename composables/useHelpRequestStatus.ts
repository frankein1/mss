import {
  helpRequestStatusLabels,
  ministryHelpRequestStatusLabels
} from '~/client/options/helpRequest'
import { labelsToOptions } from '~/utils/options'

// TODO: SHOULD BE DELETED - WE CAN NOT HANDLE SPECIFIC LABEL
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
