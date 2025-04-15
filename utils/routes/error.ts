export const routes = {
  ErrorDisabledAccount: {
    name: 'ErrorDisabledAccount',
    title: 'Votre compte est désactivé',
    path: () => '/error/disabled-account'
  },
  ErrorInvalidToken: {
    name: 'ErrorInvalidToken',
    title: "L'authentification a échoué",
    path: () => '/error/invalid-token'
  }
} as const
