<template>
  <StatsSupportPrograms
    :support-program-name-options="supportProgramNameOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    supportProgramNameOptions?: Options
  }>()
</script>
