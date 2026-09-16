<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="errorMessage"
  />
  <template v-else-if="stats.length">
    <StatsPie
      v-if="pieLabel"
      :stats="stats as StatsPiePropType"
      :pie-label="pieLabel"
    />
    <StatsList
      v-else
      :stats="stats"
    />
  </template>
  <p v-else>Aucune donnée pour les filtres sélectionnés.</p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsPiePropType, StatsListPropType } from '~~/types/stat'

  /**
   * Affichage générique d'une répartition du tableau de bord décideur.
   *
   * Les données sont préparées par la page, qui ne fait qu'une seule requête
   * pour l'ensemble des cartes. La présence de `pieLabel` détermine la forme :
   * un camembert a besoin d'une couleur par entrée, une liste non.
   */
  defineProps<{
    stats: StatsPiePropType | StatsListPropType
    pending: boolean
    error: boolean
    errorMessage: string
    pieLabel?: string
  }>()
</script>
