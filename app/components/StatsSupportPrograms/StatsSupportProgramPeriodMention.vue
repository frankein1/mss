<template>
  <p
    v-if="isPeriodFiltered"
    class="fr-text--xs text--muted fr-mb-4v"
  >
    Statistiques calculées uniquement sur les dispositifs en cours pendant la
    période sélectionnée (entrée avant la fin de la période, sortie après son
    début ou pas encore de sortie).
  </p>
</template>

<script lang="ts" setup>
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import { isSupportProgramPeriodFiltered } from '~/utils/stats'

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
  }>()

  const isPeriodFiltered = computed(() =>
    isSupportProgramPeriodFiltered(props.filters)
  )
</script>
