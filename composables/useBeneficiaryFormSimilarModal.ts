import BeneficiaryFormSimilarModal from '~/components/BeneficiaryFormSimilar/BeneficiaryFormSimilarModal.vue'
import { SimilarBeneficiary } from '~/server/route'

export function useBeneficiaryFormSimilarModal(
  similarBeneficiary: Exclude<SimilarBeneficiary, undefined>,
  createCallback: () => void
) {
  useModal().open({
    title:
      'Attention, un dossier bénéficiaire est déjà enregistré sous cette identité.',
    contentComponent: BeneficiaryFormSimilarModal,
    contentComponentProps: {
      similarBeneficiary
    },
    contentComponentEvents: {
      create: createCallback
    },
    triggerOpen: true
  })
}
