import { AppRoute } from './utils'

export const routes = {
  App: {
    name: 'App',
    title: 'Mon espace',
    path: () => `${AppRoute}`
  },
  AppOverview: {
    name: 'AppOverview',
    title: 'Tableau de bord',
    path: () => `${AppRoute}/overview`
  },
  AppAccount: {
    name: 'AppAccount',
    title: 'Mon compte',
    path: () => `${AppRoute}/account`
  }
}
