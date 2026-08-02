import { describe, test, expect } from 'vitest'
import { routes } from './landing'

const landingPageUrl = 'https://monsuivisocial.beta.gouv.fr'

describe('landing routes', () => {
  test('Accueil path returns the landing page URL', () => {
    expect(routes.Accueil.path(landingPageUrl)).toBe(landingPageUrl)
  })

  test('Sinscrire path returns /creation-compte', () => {
    expect(routes.Sinscrire.path(landingPageUrl)).toBe(
      `${landingPageUrl}/creation-compte`
    )
  })

  test('SeConnecter path returns /se-connecter URL', () => {
    expect(routes.SeConnecter.path(landingPageUrl)).toBe(
      `${landingPageUrl}/se-connecter-à-son-espace-de-travail`
    )
  })

  test('DeclarationAccessibilite path returns /declaration-accessibilite', () => {
    expect(routes.DeclarationAccessibilite.path(landingPageUrl)).toBe(
      `${landingPageUrl}/declaration-accessibilite`
    )
  })

  test('MentionsLegales path returns /mentions-legales', () => {
    expect(routes.MentionsLegales.path(landingPageUrl)).toBe(
      `${landingPageUrl}/mentions-legales`
    )
  })

  test('PolitiqueConfidentialite path returns /politique-confidentialite', () => {
    expect(routes.PolitiqueConfidentialite.path()).toBe(
      '/politique-confidentialite'
    )
  })

  test('Statistiques path returns /stats', () => {
    expect(routes.Statistiques.path(landingPageUrl)).toBe(
      `${landingPageUrl}/stats`
    )
  })

  test('Budget path returns /budget', () => {
    expect(routes.Budget.path(landingPageUrl)).toBe(`${landingPageUrl}/budget`)
  })

  test('Contact path returns /contactez-nous', () => {
    expect(routes.Contact.path(landingPageUrl)).toBe(
      `${landingPageUrl}/contactez-nous`
    )
  })

  test('PlanDuSite path returns /plan-du-site', () => {
    expect(routes.PlanDuSite.path(landingPageUrl)).toBe(
      `${landingPageUrl}/plan-du-site`
    )
  })
})
