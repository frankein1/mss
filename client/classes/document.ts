import { DocumentTag } from '~/types/document'

export function getDocumentTagClass(tag: string) {
  switch (tag) {
    case DocumentTag.Emploi:
      return 'fr-badge--purple-glycine'
    case DocumentTag.SanteHandicap:
      return 'fr-badge--green-emeraude'
    case DocumentTag.MaintienADomicile:
      return 'fr-badge--brown-caramel'
    case DocumentTag.BudgetRessources:
      return 'fr-badge--green-bourgeon'
    case DocumentTag.Logement:
      return 'fr-badge--brown-cafe-creme'
    case DocumentTag.Impot:
      return 'fr-badge--yellow-tournesol'
    case DocumentTag.Justice:
      return 'fr-badge--blue-cumulus'
    case DocumentTag.Retraite:
      return 'fr-badge--pink-macaron'
    case DocumentTag.PrestationsSociales:
      return 'fr-badge--pink-tuile'
    default:
      return ''
  }
}
