import { RdvspRoute } from './utils'

interface RdvspAfterSignInOptions {
  action: string
  id: string
}
export const routes = {
  AppRdvspAfterSignIn: {
    name: 'AppRdvspAfterSignIn',
    title: 'Action en cours',
    path: (options?: RdvspAfterSignInOptions) =>
      `${RdvspRoute}${options ? `?action=${options.action}&id=${options.id}` : ''}`
  }
}
