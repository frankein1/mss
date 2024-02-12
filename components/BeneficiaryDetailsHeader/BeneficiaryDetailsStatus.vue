<template>
  <p
    class="fr-badge"
    :class="[badgeClass]"
  >
    {{ label }}
  </p>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { beneficiaryStatusBadgeClasses } from '~/client/classes/beneficiary'
  import { beneficiaryStatusDetailedLabels } from '~/client/options'

  const props = defineProps<{
    status: BeneficiaryStatus
  }>()

  const badgeClass = computed(() => beneficiaryStatusBadgeClasses[props.status])

  const label = computed(() => beneficiaryStatusDetailedLabels[props.status])
</script>

<style lang="scss" scoped>
  .inactive-status-badge {
    color: var(--text-label-purple-glycine);
    background-color: var(--background-contrast-purple-glycine);
  }

  @media print {
    .fr-badge {
      --text-spacing: 0 0 1.5rem;

      padding: 0;

      &::before {
        content: none;
      }
    }
  }
</style>
