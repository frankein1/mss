<template>
  <StatsHelpRequest
    :social-support-subject-options="socialSupportSubjectOptions"
    :beneficiaries-cities-options="beneficiariesCitiesOptions"
    :beneficiaries-employers-options="beneficiariesEmployersOptions"
    :beneficiaries-schools-options="beneficiariesSchoolsOptions"
    :agent-options="agentOptions"
    :support-program-name-options="supportProgramNameOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    socialSupportSubjectOptions?: Options
    beneficiariesCitiesOptions?: Options
    beneficiariesEmployersOptions?: Options
    beneficiariesSchoolsOptions?: Options
    agentOptions?: Options
    supportProgramNameOptions?: Options
  }>()
</script>
