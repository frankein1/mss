import { NavigationGuardNext } from 'vue-router'
import BeneficiaryLeaveForm from '~/components/BeneficiaryLeaveForm/BeneficiaryLeaveForm.vue'

export function useLeaveConfirmation(cancelBtn: Ref<HTMLButtonElement | null>) {
  function confirmation(next: NavigationGuardNext) {
    cancelBtn.value?.click()
    useModal().open(
      'Attention les informations seront perdues',
      BeneficiaryLeaveForm,
      {},
      { cancel: () => next(false), leave: () => next() }
    )
  }

  return { confirmation }
}
