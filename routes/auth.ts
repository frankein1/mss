export const routes = {
  AuthLogin: {
    name: 'AuthLogin',
    title: 'Se connecter à ma structure',
    path: () => '/auth/login'
  },
  AuthAdmin: {
    name: 'AuthAdmin',
    title: "Se connecter à l'espace d'administration",
    path: () => '/auth/admin'
  },
  AuthValidateToken: {
    name: 'AuthValidateToken',
    title: 'Jeton en cours de vérification',
    path: () => '/auth/validate-token'
  },
  AuthLogout: {
    name: 'AuthLogout',
    title: 'Vous avez été déconnecté·e',
    path: () => '/auth/logout'
  }
} as const

export const apiRoutes = {
  ApiLogout: {
    path: () => '/api/keycloak/logout'
  },
  ApiSsoCallback: {
    path: () => '/api/keycloak/logout'
  }
} as const
