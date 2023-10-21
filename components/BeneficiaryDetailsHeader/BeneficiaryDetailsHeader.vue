<template>
  <div class="beneficiary-details-header">
    <PageTitle
      :title="title"
      no-margin
      class="title"
    />
    <BeneficiaryDetailsMetas
      class="metas"
      :beneficiary="beneficiary"
    />
    <BeneficiaryDetailsStatus
      :status="beneficiary.status"
      class="status"
    />
    <BeneficiaryDetailsActions
      class="actions"
      :beneficiary-id="beneficiary.id"
      :can-delete="canDelete"
      @deleted="emit('deleted')"
    />
  </div>
</template>

<script lang="ts" setup>
  import { GetBeneficiaryOutput } from '~/server/trpc/routers'

  defineProps<{
    title: string
    beneficiary: GetBeneficiaryOutput
    canDelete: boolean
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
