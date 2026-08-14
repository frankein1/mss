export const routes = {
  AuthLogin: {
    name: 'AuthLogin',
    title: 'Se connecter à son espace de travail',
    path: () => '/auth/login'
  },
  AuthLogout: {
    name: 'AuthLogout',
    title: 'Déconnexion effectuée',
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
  },
  ApiLogoutProconnectOnly: {
    path: () => '/api/proconnect/proconnect-logout'
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
