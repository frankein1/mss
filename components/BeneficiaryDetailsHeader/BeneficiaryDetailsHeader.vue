<template>
  <div class="beneficiary-details-header">
    <PageTitle
      :title="title"
      no-margin
      class="title"
    />
    <BeneficiaryDetailsMetas
      class="metas"
      :beneficiary-id="beneficiary.id"
      :general="beneficiary.general"
    />
    <BeneficiaryDetailsStatus
      :status="beneficiary.meta.status"
      class="status"
    />
    <BeneficiaryDetailsActions
      class="actions"
      :beneficiary-id="beneficiary.id"
      :permissions="permissions"
      @deleted="emit('deleted')"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryEditPermission } from '~/server/security'
  import { GetBeneficiaryOutput } from '~/server/route'

  defineProps<{
    title: string
    beneficiary: GetBeneficiaryOutput
    permissions: BeneficiaryEditPermission
  }>()

  const emit = defineEmits<{ deleted: [] }>()
</script>

<style lang="scss">
  .beneficiary-details-header {
    display: grid;
    gap: 0.5rem 0.5rem;
    grid-template-areas:
      'title actions'
      'metas actions'
      'status actions';
    grid-template-columns: auto max-content;
    margin-bottom: 1.5rem;
  }

  .title {
    grid-area: title;
  }

  .metas {
    grid-area: metas;
  }

  .status {
    grid-area: status;
  }

  .actions {
    grid-area: actions;
  }
</style>
