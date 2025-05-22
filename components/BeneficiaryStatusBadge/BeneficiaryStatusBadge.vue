<template>
  <!--  DSFR doesn't allow custom icons, outside of the automatic status icons-->
  <p
    v-if="status === BeneficiaryStatus.Inactive"
    class="fr-badge fr-badge--purple-glycine fr-badge--icon-left fr-icon-zzz-line"
    :class="{ 'fr-badge--sm': small }"
  >
    <span>{{ label }}</span>
  </p>
  <p
    v-else-if="status === BeneficiaryStatus.Archived"
    class="fr-badge fr-badge--error"
    :class="{ 'fr-badge--sm': small }"
  >
    <span>{{ label }}</span>
  </p>
  <DsfrBadge
    v-else
    :type="type"
    :label="label"
    :small="small"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { beneficiaryStatusBadgeType } from '~/client/classes/beneficiary'
  import { beneficiaryStatusDetailedKeys } from '~/client/options'

  interface Props {
    status: BeneficiaryStatus
    small?: boolean
  }

  const { status, small = false } = defineProps<Props>()

  const type = computed(() => beneficiaryStatusBadgeType[status])

  const label = computed(
    () => beneficiaryStatusDetailedKeys.value(status) || ''
  )
</script>
