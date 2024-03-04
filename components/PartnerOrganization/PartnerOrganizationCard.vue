<template>
  <div class="partner-card">
    <div class="fr-h6 fr-m-0">
      {{ partner.name }}
    </div>
    <div
      v-if="partner.address || partner.zipcode || partner.city"
      class="fr-icon-map-pin-2-line partner-card-content__info fr-icon--sm fr-text--sm"
    >
      {{
        `${partner.address || ''} ${partner.zipcode || ''} ${partner.city || ''}`
      }}
    </div>
    <div
      v-if="partner.phone1"
      class="fr-icon-phone-line partner-card-content__info fr-icon--sm fr-text--sm"
    >
      {{ partner.phone1 }}
    </div>
    <div
      v-if="partner.phone2"
      class="fr-icon-phone-line partner-card-content__info fr-icon--sm fr-text--sm"
    >
      {{ partner.phone2 }}
    </div>
    <div
      v-if="partner.email"
      class="fr-icon-mail-line partner-card-content__info fr-icon--sm fr-text--sm"
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
    <div
      v-for="(contact, idx) in partner.contacts"
      :key="contact.id"
      :index="idx"
      class="fr-pt-1w"
    >
      <hr
        class="fr-m-0 fr-p-0 fr-pt-1w partner-card-content__contact__separator"
      />
      <div class="fr-text--md fr-text--bold fr-m-0">{{ contact.name }}</div>
      <div class="fr-text--sm fr-m-0">{{ contact.phone }}</div>
      <div class="fr-text--sm fr-m-0">{{ contact.email }}</div>
    </div>

    <div class="partner-card__action-bar">
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        @click="emit('edit', partner.id)"
      >
        Modifier la Organisme partenaire
      </button>
      <button
        v-if="application.module.partner"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line partner-card__action-bar__delete"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        @click="emit('delete', partner)"
      >
        Supprimer l'organisme partenaire
      </button>
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
    delete: [partner: PartnerOrganizationData]
  }>()

  const { application } = usePermissions()
</script>

<style lang="scss" scoped>
  .partner-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.5rem;
  }

  .partner-card__action-bar {
    display: flex;
    flex-flow: row-reverse wrap;
  }

  .partner-card__action-bar__delete {
    color: red;
  }

  .partner-card-content__info {
    color: var(--text-default-grey);
    margin-bottom: 0;

    &::before {
      margin-right: 0.5rem;
    }
  }

  .partner-card-content__working-hours {
    color: var(--text-mention-grey);
    margin-bottom: 0;
  }

  .partner-card-content__contact__separator {
    width: 3rem;
  }
</style>
