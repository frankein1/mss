import BeneficiaryLeaveForm from '~/components/BeneficiaryLeaveForm/BeneficiaryLeaveForm.vue'

export function useLeaveBeneficiaryFormConfirmation() {
  onBeforeRouteLeave((_, __, next) => {
    useModal().open({
      title: 'Attention les informations seront perdues',
      contentComponent: BeneficiaryLeaveForm,
      contentComponentEvents: {
        cancel: () => next(false),
        leave: () => next()
      },
      triggerOpen: true
    })
  })
}
