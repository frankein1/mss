<template>
  <div class="partner-card fr-p-2w fr-mb-2w">
    <div class="partner-card-header">
      <div class="partner-card-header-title fr-h6 fr-m-0">
        {{ partner.name }}
      </div>
      <div class="partner-card-header-action">
        <button
          v-if="application.module.partner"
          class="fr-btn fr-btn--sm fr-btn--secondary fr-icon-pencil-line"
          data-fr-opened="false"
          aria-controls="global-modal"
          type="button"
          @click="emit('edit', partner.id)"
        >
          Modifier la Organisme partenaire
        </button>
      </div>
    </div>
    <div v-if="partner.siret">
      <span class="fr-icon-file-text-line" />
      <span class="partner-info fr-text--sm">
        {{ partner.siret }}
      </span>
    </div>

    <div v-if="partner.address || partner.zipcode || partner.city">
      <span class="fr-icon-map-pin-2-line" />
      <span class="partner-info fr-text--sm">{{
        `${partner.address || ''} ${partner.zipcode || ''} ${partner.city || ''}`
      }}</span>
    </div>
    <div v-if="partner.phone1">
      <span class="fr-icon-phone-line" />
      <span class="partner-info fr-text--sm">
        {{ partner.phone1 }}
      </span>
    </div>
    <div v-if="partner.phone2">
      <span class="fr-icon-phone-line" />
      <span class="partner-info fr-text--sm">
        {{ partner.phone2 }}
      </span>
    </div>
    <div v-if="partner.email">
      <span class="fr-icon-mail-line" />
      <span class="partner-info fr-text--sm">
        {{ partner.email }}
      </span>
    </div>
    <div
      v-if="partner.workingHours"
      class="partner-info working-hours fr-text--sm fr-m-0"
    >
      <div>Horaires:</div>
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
  }>()

  const { application } = usePermissions()
</script>

<style lang="scss">
  .partner-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .partner-card-header {
    display: flex;
    flex-wrap: wrap;

    .partner-card-header-title {
      flex: 0 0 calc(66.666% - 12px);
    }

    .partner-card-header-action {
      margin-left: auto;
    }
  }

  .partner-info {
    color: var(--text-default-grey);
    margin-bottom: 0;
    padding-left: 4px;
  }

  .working-hours {
    color: var(--text-mention-grey);
    margin-bottom: 0;
  }
</style>
