<template>
  <div class="beneficiary-details-header">
    <button
      class="fr-btn fr-btn--icon-left fr-icon-user-add-line edit-btn"
      data-fr-opened="false"
      aria-controls="global-modal"
      type="button"
      @click="onOpenModal"
    >
      Ajouter un membre au dossier
    </button>
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
      :status="beneficiary.status"
      class="status"
    />
  </div>
</template>

<script lang="ts" setup>
  import BeneficiaryAddForm from '../BeneficiaryAddForm/BeneficiaryAddForm.vue'
  import { GetBeneficiaryOutput } from '~/types/beneficiary'

  defineProps<{
    title: string
    beneficiary: GetBeneficiaryOutput
  }>()

  const modal = useModal()
  // TODO: MODALE
  const onOpenModal = () => {
    modal.open(BeneficiaryAddForm, {
      title: 'Ajouter un membre au dossier'
    })
  }
</script>

<style lang="scss">
  .beneficiary-details-header {
    display: grid;
    gap: 0.5rem;
    grid-template-areas:
      'title actions'
      'metas actions'
      'status actions';
    grid-template-columns: auto max-content;
    margin-bottom: 1.5rem;
    align-items: baseline;
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
