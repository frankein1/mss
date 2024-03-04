import LeaveFormModal from '~/components/LeaveFormModal/LeaveFormModal.vue'

export function useLeaveFormConfirmation(options?: {
  onLeave?: () => void
  isFormDirty?: Ref<boolean>
}) {
  const isNavigatingWithFormActions = ref(false)

  onBeforeRouteLeave((_, __, next) => {
    if (
      isNavigatingWithFormActions.value ||
      (options?.isFormDirty && !options.isFormDirty.value)
    ) {
      return next()
    }

    useModal().open({
      title: 'Attention les informations seront perdues',
      contentComponent: LeaveFormModal,
      contentComponentEvents: {
        cancel: () => next(false),
        leave: () => {
          if (options?.onLeave) {
            options?.onLeave()
          }
          next()
        }
      },
      triggerOpen: true
    })
  })

  return { isNavigatingWithFormActions }
}
