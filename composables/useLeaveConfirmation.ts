import { NavigationGuardNext } from 'vue-router'
import BeneficiaryLeaveForm from '~/components/BeneficiaryLeaveForm/BeneficiaryLeaveForm.vue'

export function useLeaveConfirmation() {
  function confirmation(next: NavigationGuardNext) {
    useModal().open({
      title: 'Attention les informations seront perdues',
      contentComponent: BeneficiaryLeaveForm,
      contentComponentEvents: {
        cancel: () => next(false),
        leave: () => next()
      },
      triggerOpen: true
    })
  }

  return { confirmation }
}
