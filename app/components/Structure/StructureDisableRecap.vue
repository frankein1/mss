<template>
  <p class="fr-mb-0">Pour cette structure :</p>
  <ul>
    <li>{{ structure._count.users }} utilisateurs seront anonymisés</li>
    <li>
      {{ structure._count.beneficiaries }} bénéficiaires seront anonymisés
    </li>
    <li>
      {{ structure._count.socialSupports }} accompagnements seront anonymisés
    </li>
  </ul>
  <p class="fr-mb-4v">
    Les éléments suivants seront supprimés : notifications, commentaires,
    documents, budget, ateliers.
  </p>
</template>

<script lang="ts" setup>
  import type { AdminStructureInfo } from './types'

  defineProps<{
    structure: AdminStructureInfo
  }>()
</script>
