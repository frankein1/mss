export function getDocumenTagClass(tag: string) {
  if (tag === 'emploi') {
    return 'fr-badge--purple-glycine'
  }
  if (tag === 'santeHandicap') {
    return 'fr-badge--green-emeraude'
  }
  if (tag === 'maintienADomicile') {
    return 'fr-badge--brown-caramel'
  }
  if (tag === 'budgetRessources') {
    return 'fr-badge--green-bourgeon'
  }
  if (tag === 'logement') {
    return 'fr-badge--brown-cafe-creme'
  }
  if (tag === 'impot') {
    return 'fr-badge--yellow-tournesol'
  }
  if (tag === 'justice') {
    return 'fr-badge--blue-cumulus'
  }
  if (tag === 'retraite') {
    return 'fr-badge--pink-macaron'
  }
  if (tag === 'prestationsSociales') {
    return 'fr-badge--pink-tuile'
  }
  return ''
}
