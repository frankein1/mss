import BeneficiaryFormSimilarModal from '~/components/BeneficiaryFormSimilar/BeneficiaryFormSimilarModal.vue'
import { SimilarBeneficiary } from '~/server/route'

export function useBeneficiaryFormSimilarModal(
  similarBeneficiary: Exclude<SimilarBeneficiary, undefined>,
  createCallback: () => void
) {
  useModal().open(BeneficiaryFormSimilarModal, {
    title:
      'Attention, un dossier bénéficiaire est déjà enregistré sous cette identité.',
    triggerOpen: true,
    similarBeneficiary,
    create: createCallback
  })
}
