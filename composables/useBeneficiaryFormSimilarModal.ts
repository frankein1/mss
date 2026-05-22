import BeneficiaryFormSimilarModal from '~/components/BeneficiaryFormSimilar/BeneficiaryFormSimilarModal.vue'
import type { SimilarBeneficiary } from '~/server/route'

export function useBeneficiaryFormSimilarModal(
  modal: any,
  similarBeneficiary: Exclude<SimilarBeneficiary, undefined>,
  createCallback: () => void
) {
  modal.open(BeneficiaryFormSimilarModal, {
    title:
      'Attention, un dossier bénéficiaire est déjà enregistré sous cette identité.',
    triggerOpen: true,
    similarBeneficiary,
    create: createCallback
  })
}
