export const routes = {
  Index: {
    name: 'Index',
    title: '',
    path: () => '/'
  },
  Register: {
    name: 'Register',
    title: 'Enregistrer ma structure',
    path: () => '/register'
  },
  DeclarationAccessibilite: {
    name: 'DeclarationAccessibilite',
    title: "Déclaration d'accessibilité",
    path: () => '/declaration-accessibilite'
  },
  MentionsLegales: {
    name: 'MentionsLegales',
    title: 'Mentions légales',
    path: () => '/mentions-legales'
  },
  PolitiqueConfidentialite: {
    name: 'PolitiqueConfidentialite',
    title: 'Politique de confidentialité',
    path: () => '/politique-confidentialite'
  },
  Statistiques: {
    name: 'Statistiques',
    title: "Statistiques d'utilisation",
    path: () => '/statistiques'
  }
} as const
