<template>
  <StatsBeneficiaries
    class="stats-filters"
    :social-support-subject-options="socialSupportSubjectOptions"
    :beneficiaries-cities-options="beneficiariesCitiesOptions"
    :beneficiaries-schools-options="beneficiariesSchoolsOptions"
    :agent-options="agentOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    socialSupportSubjectOptions?: Options
    beneficiariesCitiesOptions?: Options
    beneficiariesSchoolsOptions?: Options
    agentOptions?: Options
  }>()
</script>

<style scoped lang="scss">
  /* stylelint-disable selector-class-pattern */
  .stats-filters {
    :deep(.fromAge),
    :deep(.toAge) {
      .fr-input-wrap::before {
        bottom: 0.75rem;
        margin: auto;
        pointer-events: none;
        position: absolute;
        right: 1.75rem;
        top: 0.75rem;
        content: 'an(s)';
        line-height: 1rem;
      }

      .fr-input {
        padding-right: 4rem;
      }
    }
  }
  /* stylelint-enable selector-class-pattern */
</style>
