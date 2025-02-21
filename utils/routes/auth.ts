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

export const apiProConnectRoutes = {
  ApiSignIn: {
    path: () => '/api/proconnect/signin'
  },
  ApiLogout: {
    path: () => '/api/proconnect/logout'
  },
  ApiSsoCallback: {
    path: () => '/api/proconnect/login-callback'
  }
} as const

interface RdvspAfterSignInOptions {
  action: string
  id: string
}

export const apiRdvspRoutes = {
  ApiSignIn: {
    path: (options?: RdvspAfterSignInOptions) =>
      `/api/rdvservicepublic/signin${options ? `?action=${options.action}&id=${options.id}` : ''}`
  },
  ApiLogout: {
    path: () => '/api/rdvservicepublic/logout'
  },
  ApiCallback: {
    path: () => '/api/auth/rdvservicepublic/callback'
  }
} as const
