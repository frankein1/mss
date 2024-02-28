import {
  fileInstructionStatusLabels,
  ministryFileInstructionStatusLabels,
  socialSupportStatusLabels,
  ministrySocialSupportStatusLabels
} from '~/client/options'
import { labelsToOptions } from '~/utils/options'

// TODO: SHOULD BE DELETED - WE CAN NOT HANDLE SPECIFIC LABEL
export function useSocialSupportStatus() {
  const { application } = usePermissions()

  const _fileInstructionStatusLabels = computed(() =>
    application.value.module.ministere
      ? ministryFileInstructionStatusLabels
      : fileInstructionStatusLabels
  )

  const _fileInstructionStatusOptions = computed(() =>
    labelsToOptions(_fileInstructionStatusLabels.value)
  )

  const _socialSupportStatusLabels = computed(() =>
    application.value.module.ministere
      ? ministrySocialSupportStatusLabels
      : socialSupportStatusLabels
  )
  const _socialSupportStatusOptions = computed(() =>
    labelsToOptions(_socialSupportStatusLabels.value)
  )

  return {
    fileInstructionStatusLabels: _fileInstructionStatusLabels,
    fileInstructionStatusOptions: _fileInstructionStatusOptions,
    socialSupportStatusLabels: _socialSupportStatusLabels,
    socialSupportStatusOptions: _socialSupportStatusOptions
  }
}
