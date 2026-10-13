import { AppRoute } from './utils'

const StatsRoute = `${AppRoute}/stats`

export const routes = {
  AppStats: {
    name: 'AppStats',
    title: 'Statistiques',
    path: () => StatsRoute
  },
  AppStatsBeneficiaries: {
    name: 'AppStatsBeneficiaries',
    title: 'Bénéficiaires',
    path: () => `${StatsRoute}/beneficiaries`
  },
  AppStatsFollowups: {
    name: 'AppStatsFollowups',
    title: "Synthèses d'entretiens",
    path: () => `${StatsRoute}/followups`
  },
  AppStatsFileInstructions: {
    name: 'AppStatsFileInstructions',
    title: 'Instructions de dossiers',
    path: () => `${StatsRoute}/file-instructions`
  },
  AppStatsWorkshops: {
    name: 'AppStatsWorkshops',
    title: 'Ateliers',
    path: () => `${StatsRoute}/workshops`
  },
  AppStatsSupportPrograms: {
    name: 'AppStatsSupportPrograms',
    title: 'Parcours et dispositifs',
    path: () => `${StatsRoute}/support-programs`
  }
} as const
