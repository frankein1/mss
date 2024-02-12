import {
  socialSupportStatusLabels,
  ministrySocialSupportStatusLabels
} from '~/client/options'
import { labelsToOptions } from '~/utils/options'

// TODO: SHOULD BE DELETED - WE CAN NOT HANDLE SPECIFIC LABEL
export function useSocialSupportStatus() {
  const { application } = usePermissions()

  const statusLabels = computed(() =>
    application.value.module.ministere
      ? ministrySocialSupportStatusLabels
      : socialSupportStatusLabels
  )
  const statusOptions = computed(() => labelsToOptions(statusLabels.value))

  return {
    socialSupportStatusLabels: statusLabels,
    helpRequestStatusOptions: statusOptions
  }
}
