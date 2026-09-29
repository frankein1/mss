import { AppRoute } from './utils'

const DecisionMakerRoute = `${AppRoute}/decideur`

export const routes = {
  AppDecisionMaker: {
    name: 'AppDecisionMaker',
    title: 'Espace décideur',
    path: () => DecisionMakerRoute
  },
  AppDecisionMakerStatistics: {
    name: 'AppDecisionMakerStatistics',
    title: 'Statistiques',
    path: () => `${DecisionMakerRoute}/statistiques`
  },
  AppDecisionMakerStatisticsBeneficiaries: {
    name: 'AppDecisionMakerStatisticsBeneficiaries',
    title: 'Bénéficiaires',
    path: () => `${DecisionMakerRoute}/statistiques/beneficiaires`
  },
  AppDecisionMakerStatisticsFollowups: {
    name: 'AppDecisionMakerStatisticsFollowups',
    title: 'Entretiens',
    path: () => `${DecisionMakerRoute}/statistiques/entretiens`
  },
  AppDecisionMakerStatisticsFileInstructions: {
    name: 'AppDecisionMakerStatisticsFileInstructions',
    title: 'Instructions de dossiers',
    path: () => `${DecisionMakerRoute}/statistiques/instructions`
  },
  AppDecisionMakerStatisticsWorkshops: {
    name: 'AppDecisionMakerStatisticsWorkshops',
    title: 'Ateliers',
    path: () => `${DecisionMakerRoute}/statistiques/ateliers`
  },
  AppDecisionMakerConfiguration: {
    name: 'AppDecisionMakerConfiguration',
    title: 'Configuration',
    path: () => `${DecisionMakerRoute}/configuration`
  },
  AppDecisionMakerConfigurationAccount: {
    name: 'AppDecisionMakerConfigurationAccount',
    title: 'Infos du compte',
    path: () => `${DecisionMakerRoute}/configuration/compte`
  },
  AppDecisionMakerConfigurationStructures: {
    name: 'AppDecisionMakerConfigurationStructures',
    title: 'Structures associées',
    path: () => `${DecisionMakerRoute}/configuration/structures`
  }
} as const
