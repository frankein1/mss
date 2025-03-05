import { AppRoute } from './utils'

interface Options {
  filter: string
}
export const routes = {
  App: {
    name: 'App',
    title: 'Mon espace',
    path: () => `${AppRoute}`
  },
  AppOverview: {
    name: 'AppOverview',
    title: 'Tableau de bord',
    path: (options?: Options) =>
      `${AppRoute}/overview` + `${options ? `?filter=${options.filter}` : ''}`
  }
} as const
