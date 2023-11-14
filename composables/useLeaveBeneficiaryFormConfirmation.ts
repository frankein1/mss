import BeneficiaryLeaveForm from '~/components/BeneficiaryLeaveForm/BeneficiaryLeaveForm.vue'

export function useLeaveBeneficiaryFormConfirmation(
  isNavigatingWithFormActions: Ref<boolean>,
  options?: { onLeave?: () => void; isFormDirty?: Ref<boolean> }
) {
  onBeforeRouteLeave((_, __, next) => {
    if (
      isNavigatingWithFormActions.value ||
      (options?.isFormDirty && !options.isFormDirty.value)
    ) {
      return next()
    }

    useModal().open({
      title: 'Attention les informations seront perdues',
      contentComponent: BeneficiaryLeaveForm,
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
}
