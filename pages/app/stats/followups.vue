<template>
  <StatsFollowup
    :social-support-subject-options="socialSupportSubjectOptions"
    :beneficiaries-cities-options="beneficiariesCitiesOptions"
    :agent-options="agentOptions"
    :device-name-options="deviceNameOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    socialSupportSubjectOptions?: Options
    beneficiariesCitiesOptions?: Options
    agentOptions?: Options
    deviceNameOptions?: Options
  }>()
</script>
