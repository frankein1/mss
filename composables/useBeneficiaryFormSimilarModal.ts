import BeneficiaryFormSimilarModal from '~/components/BeneficiaryFormSimilar/BeneficiaryFormSimilarModal.vue'
import { SimilarBeneficiaries } from '~/server/route'

const ONE_SIMILAR_TITLE =
  'Attention, un dossier bénéficiaire est déjà enregistré sous cette identité.'
const MULTIPLE_SIMILAR_TITLE =
  'Attention, plusieurs dossiers bénéficiaires sont déjà enregistrés sous cette identité.'

export function useBeneficiaryFormSimilarModal(
  similarBeneficiaries: SimilarBeneficiaries,
  createCallback: () => void
) {
  const title =
    similarBeneficiaries.length === 1
      ? ONE_SIMILAR_TITLE
      : MULTIPLE_SIMILAR_TITLE

  useModal().open({
    title,
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
