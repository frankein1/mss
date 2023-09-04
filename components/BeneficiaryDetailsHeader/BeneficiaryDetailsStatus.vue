<template>
  <p
    class="fr-badge fr-my-0"
    :class="[badgeClass]"
  >
    {{ label }}
  </p>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { beneficiaryStatusBadgeClasses } from '~/client/classes/beneficiary'
  import { beneficiaryStatusDetailedLabels } from '~/client/options/beneficiary'

  const props = defineProps<{
    status: BeneficiaryStatus
  }>()

  const badgeClass = computed(() => beneficiaryStatusBadgeClasses[props.status])

  const label = computed(() => beneficiaryStatusDetailedLabels[props.status])
</script>

<style lang="scss">
  .inactive-status-badge {
    color: var(--text-label-purple-glycine);
    background-color: var(--background-contrast-purple-glycine);
  }
</style>
