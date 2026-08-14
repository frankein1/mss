export const routes = {
  Accueil: {
    name: 'Accueil',
    title: 'Accueil',
    path: (landingPageUrl: string) => landingPageUrl
  },
  Sinscrire: {
    name: 'S’inscrire',
    title: 'Créer mon compte',
    path: (landingPageUrl: string) => `${landingPageUrl}/creation-compte`
  },
  SeConnecter: {
    name: 'Se connecter',
    title: 'Se connecter à son espace de travail',
    path: (landingPageUrl: string) =>
      `${landingPageUrl}/se-connecter-à-son-espace-de-travail`
  },
  DeclarationAccessibilite: {
    name: 'DeclarationAccessibilite',
    title: "Déclaration d'accessibilité",
    path: (landingPageUrl: string) =>
      `${landingPageUrl}/declaration-accessibilite`
  },
  MentionsLegales: {
    name: 'MentionsLegales',
    title: 'Mentions légales',
    path: (landingPageUrl: string) => `${landingPageUrl}/mentions-legales`
  },
  PolitiqueConfidentialite: {
    name: 'PolitiqueConfidentialite',
    title: 'Politique de confidentialité',
    path: () => '/politique-confidentialite'
  },
  Statistiques: {
    name: 'Statistiques',
    title: "Statistiques d'utilisation",
    path: (landingPageUrl: string) => `${landingPageUrl}/stats`
  },
  Budget: {
    name: 'Budget',
    title: 'Budget',
    path: (landingPageUrl: string) => `${landingPageUrl}/budget`
  },
  Contact: {
    name: 'Contact',
    title: 'Contact',
    path: (landingPageUrl: string) => `${landingPageUrl}/contactez-nous`
  },
  PlanDuSite: {
    name: 'PlanDuSite',
    title: 'Plan du Site',
    path: (landingPageUrl: string) => `${landingPageUrl}/plan-du-site`
  }
} as const
