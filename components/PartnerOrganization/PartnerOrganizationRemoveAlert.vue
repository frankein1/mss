<template>
  <div>
    <div class="fr-m-2w">
      Veuillez confirmer la suppression de l'organisme partenaire
      {{ partner.name }}.
    </div>
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--secondary"
        title="Annuler"
        type="button"
        @click="onCancel"
      >
        Annuler
      </button>
      <button
        class="fr-btn"
        title="Supprimer"
        type="button"
        @click="onFinish"
      >
        Valider
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
  .button-bar {
    display: flex;
    gap: 01.5rem;
    justify-content: center;
  }
</style>
