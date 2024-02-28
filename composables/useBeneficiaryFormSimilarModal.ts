import BeneficiaryFormSimilarModal from '~/components/BeneficiaryFormSimilar/BeneficiaryFormSimilarModal.vue'
import { SimilarBeneficiaries } from '~/server/route'

export function useBeneficiaryFormSimilarModal(
  similarBeneficiaries: SimilarBeneficiaries,
  createCallback: () => void
) {
  useModal().open({
    title:
      'Attention, un·e bénéficiaire est déjà enregistré·e sous cette identité.',
    contentComponent: BeneficiaryFormSimilarModal,
    contentComponentProps: {
      similarBeneficiaries
    },
    contentComponentEvents: {
      create: createCallback
    },
    triggerOpen: true
  })
}
