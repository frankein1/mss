import {
  helpRequestStatusLabels,
  ministryHelpRequestStatusLabels
} from '~/client/options/helpRequest'
import { labelsToOptions } from '~/utils/options'

// TODO: SHOULD BE DELETED - WE CAN NOT HANDLE SPECIFIC LABEL
export function useHelpRequestStatus() {
  const { application } = usePermissions()

  const statusLabels = computed(() =>
    application.value.module.ministere
      ? ministryHelpRequestStatusLabels
      : helpRequestStatusLabels
  )
  const statusOptions = computed(() => labelsToOptions(statusLabels.value))

  return {
    helpRequestStatusLabels: statusLabels,
    helpRequestStatusOptions: statusOptions
  }
}
