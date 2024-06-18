<template>
  <div>
    <h3>Stats Filters</h3>

    <h4>Instructions de dossier</h4>

    <p>Options des filtres de statistiques pour les instructions de dossier</p>

    <StatsFilters
      v-model:filters="filtersFI"
      :social-support-subject-options="socialSupportSubjectOptions"
      :beneficiaries-cities-options="beneficiariesCitiesOptions"
      :agent-options="agentOptions"
      is-help-requests-tab
    />

    <div class="fr-mt-2w">{{ filtersFI }}</div>

    <h4>Synthèses d'entretien</h4>

    <p>Options des filtres de statistiques pour les synthèses d'entretien</p>

    <StatsFilters
      v-model:filters="filtersFW"
      :social-support-subject-options="socialSupportSubjectOptions"
      :beneficiaries-cities-options="beneficiariesCitiesOptions"
      :agent-options="agentOptions"
    />

    <div class="fr-mt-2w">{{ filtersFW }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { StatFilterInput } from '~/server/schema'
  import type { Options } from '~/utils/options'
  import { toOptions, withEmptyValue } from '~/utils/options'

  const filtersFI = ref<StatFilterInput>({})

  const filtersFW = ref<StatFilterInput>({})

  const socialSupportSubjectOptions: Options = [
    { value: 'aide-logement', label: 'Aide financière - logement' },
    { value: 'aide-transport', label: 'Aide non remboursable - transport' },
    { value: 'demande-rsa', label: 'Demande de RSA' },
    { value: 'domiciliation', label: 'Domiciliation' },
    { value: 'famille-accueil', label: "Entrée en famille d'accueil" },
    { value: 'retraite', label: 'Retraite - infos droits et démarches' }
  ]

  const beneficiariesCitiesOptions: Options = [
    { value: 'paris-15', label: 'Paris 15e' },
    { value: 'nantes', label: 'Nantes' },
    { value: 'autun', label: 'Autun' },
    { value: 'perpignan', label: 'Perpignan' },
    { value: 'oyonnax', label: 'Oyonnax' },
    { value: 'quimper', label: 'Quimper' }
  ]

  const agentOptions: Options = withEmptyValue(
    toOptions(
      [
        { value: 'responsable', label: 'Jeanne Responsable' },
        { value: 'referent', label: 'Jean Référent' },
        { value: 'travailleur-social', label: 'Jean Travailleur Social' },
        { value: 'instructeur', label: 'Jeanne Instructeur' }
      ],
      'value',
      'label'
    )
  )
</script>
