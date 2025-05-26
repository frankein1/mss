<template>
  <!--  DSFR doesn't allow custom icons, outside of the automatic status icons.
    The inactive status uses an icon outside of the DSFR, hence the need of a
    customized version of the component -->
  <p
    v-if="status === BeneficiaryStatus.Inactive"
    class="fr-badge fr-badge--purple-glycine fr-badge--icon-left fr-icon-zzz-line"
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

  const label = computed(() =>
    !small && status === BeneficiaryStatus.Archived
      ? // Use a longer label when the badge is not small
        'Ancien dossier "archivé"'
      : beneficiaryStatusDetailedKeys.byKey[status]
  )
</script>
