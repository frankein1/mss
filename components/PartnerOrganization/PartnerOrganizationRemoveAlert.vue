<template>
  <div class="partner-alert">
    <div class="fr-text--md">
      L’organisme ne sera plus visible dans l’annuaire et ne pourra plus être
      sélectionné dans les formulaires. En revanche il restera visible dans vos
      statistiques.
    </div>
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--icon-left fr-icon-delete-line delete"
        title="Supprimer"
        type="button"
        @click="onFinish"
      >
        Supprimer
      </button>
      <button
        class="fr-btn fr-btn--secondary"
        title="Annuler"
        type="button"
        @click="onCancel"
      >
        Annuler
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PartnerOrganizationData } from './types'

  const props = defineProps<{
    partner: PartnerOrganizationData
  }>()

  const emit = defineEmits<{
    finish: [id: string]
    cancel: []
  }>()

  function onCancel() {
    emit('cancel')
  }
  function onFinish() {
    emit('finish', props.partner.id)
  }
</script>

<style lang="scss" scoped>
  .partner-alert {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .button-bar {
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;

    .delete {
      background-color: var(--text-default-error);
    }
  }
</style>
