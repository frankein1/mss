export const routes = {
  ErrorDisabledAccount: {
    name: 'ErrorDisabledAccount',
    title: 'Votre compte est désactivé',
    path: () => '/error/disabled-account'
  },
  ErrorUnknownUser: {
    name: 'ErrorUnknownUser',
    title: "Votre compte ProConnect n'est pas rattaché",
    path: () => '/error/unknown-user'
  },
  ErrorUnknownUserInclusionConnect: {
    name: 'ErrorUnknownUser',
    title: "Votre compte InclusionConnect n'est pas rattaché",
    path: () => '/error/unknown-user-ic'
  },
  ErrorInvalidToken: {
    name: 'ErrorInvalidToken',
    title: "L'authentification a échoué",
    path: () => '/error/invalid-token'
  }
} as const
