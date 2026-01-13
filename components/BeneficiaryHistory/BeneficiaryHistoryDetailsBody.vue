<template>
  <div
    :id="collapseId"
    class="fr-collapse beneficiary-history-details-body"
  >
    <template v-if="expanded">
      <BeneficiaryHistoryDetailsAppointment
        v-if="type === 'Appointment'"
        :id="Number(socialSupportId)" />
      <BeneficiaryHistoryDetailsBodyContentProvider
        v-else
        :social-support-id="socialSupportId"
        :family-file-permissions="familyFilePermissions"
        @deleted="emit('deleted')"
    /></template>
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportType } from '@prisma/client'
  import type { FamilyFilePermissions } from '~/server/security'

  defineProps<{
    expanded: boolean
    socialSupportId: string
    collapseId: string
    type: SocialSupportType
    familyFilePermissions: FamilyFilePermissions
  }>()

  const emit = defineEmits<{
    deleted: []
  }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/dsfr/core/index' as dsfr;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .beneficiary-history-details-body {
    --text-spacing: 0 0 1rem;

    border-radius: 0 0 0.5rem 0.5rem;

    &.fr-collapse--expanded {
      padding: 0.5rem 1.5rem 1rem;
    }
  }
</style>

<style>
  .beneficiary-history-details-body .information-label {
    color: var(--text-mention-grey);
    font-weight: 400;
  }

  .beneficiary-history-details-body li {
    font-weight: 500;
  }
</style>
