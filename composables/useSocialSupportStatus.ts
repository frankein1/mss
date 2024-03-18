import {
  fileInstructionStatusKeys,
  ministryFileInstructionStatusKeys,
  socialSupportStatusKeys,
  ministrySocialSupportStatusKeys
} from '~/client/options'

// TODO: SHOULD BE DELETED - WE CAN NOT HANDLE SPECIFIC LABEL
export function useSocialSupportStatus() {
  const { application } = usePermissions()

  const _fileInstructionStatusKeys = computed(() =>
    application.value.module.ministere
      ? ministryFileInstructionStatusKeys
      : fileInstructionStatusKeys
  )

  const _fileInstructionStatusOptions = computed(
    () => _fileInstructionStatusKeys.value.options
  )

  const _socialSupportStatusKeys = computed(() =>
    application.value.module.ministere
      ? ministrySocialSupportStatusKeys
      : socialSupportStatusKeys
  )
  const _socialSupportStatusOptions = computed(
    () => _socialSupportStatusKeys.value.options
  )

  return {
    fileInstructionStatusKeys: _fileInstructionStatusKeys,
    fileInstructionStatusOptions: _fileInstructionStatusOptions,
    socialSupportStatusKeys: _socialSupportStatusKeys,
    socialSupportStatusOptions: _socialSupportStatusOptions
  }
}
