<template>
  <div class="partner-card">
    <div class="partner-card-header">
      <div class="partner-card-header__title fr-h6 fr-m-0">
        {{ partner.name }}
      </div>
      <div class="partner-card-header__action">
        <button
          v-if="application.module.partner"
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-delete-line"
          data-fr-opened="false"
          aria-controls="global-modal"
          type="button"
          @click="emit('delete', partner.id)"
        >
          Supprimer l'organisme partenaire
        </button>
        <button
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-pencil-line"
          data-fr-opened="false"
          aria-controls="global-modal"
          type="button"
          @click="emit('edit', partner.id)"
        >
          Modifier la Organisme partenaire
        </button>
      </div>
    </div>
    <div
      v-if="partner.address || partner.zipcode || partner.city"
      class="fr-icon-map-pin-2-line partner-card-content__info fr-text--sm"
    >
      {{
        `${partner.address || ''} ${partner.zipcode || ''} ${partner.city || ''}`
      }}
    </div>
    <div
      v-if="partner.phone1"
      class="fr-icon-phone-line partner-card-content__info fr-text--sm"
    >
      {{ partner.phone1 }}
    </div>
    <div
      v-if="partner.phone2"
      class="fr-icon-phone-line partner-card-content__info fr-text--sm"
    >
      {{ partner.phone2 }}
    </div>
    <div
      v-if="partner.email"
      class="fr-icon-mail-line partner-card-content__info fr-text--sm"
    >
      {{ partner.email }}
    </div>
    <div
      v-if="partner.workingHours"
      class="partner-card-content__info partner-card-content__working-hours fr-text--sm fr-m-0"
    >
      <div>Horaires :</div>
      {{ partner.workingHours }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PartnerOrganizationData } from './types'

  defineProps<{
    partner: PartnerOrganizationData
  }>()

  const emit = defineEmits<{
    edit: [id: string]
    delete: [id: string]
  }>()

  const { application } = usePermissions()
</script>

<style lang="scss">
  .partner-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
  }

  .partner-card-header {
    display: flex;
    flex-wrap: wrap;
  }

  .partner-card-header__title {
    flex: 0 0 calc(66.666% - 0.75rem);
  }

  .partner-card-header__action {
    gap: 0.25rem;
    display: flex;
    margin-left: auto;
  }

  .partner-card-content__info {
    color: var(--text-default-grey);
    margin-bottom: 0;

    &::before {
      padding-right: 0.5rem;
    }
  }

  .partner-card-content__working-hours {
    color: var(--text-mention-grey);
    margin-bottom: 0;
  }
</style>
