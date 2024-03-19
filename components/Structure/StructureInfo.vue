<template>
  <div class="feature-section bg-color-white structure-configuration-info">
    <h2 class="fr-h4 structure-configuration-info__title">
      Informations sur votre structure
    </h2>

    <div class="fr-grid-row structure-configuration-info__content">
      <div class="fr-col-12">
        <span class="structure-configuration-info__content__label fr-mr-1w">
          {{ structureFieldLabels.name }} :
        </span>
        <span>{{ structure.name }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-configuration-info__content__label fr-mr-1w">
          {{ structureFieldLabels.address }} :
        </span>
        <span>{{ structure.address }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-configuration-info__content__label fr-mr-1w">
          {{ structureFieldLabels.zipcode }} :
        </span>
        <span>{{ structure.zipcode }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-configuration-info__content__label fr-mr-1w">
          {{ structureFieldLabels.city }} :
        </span>
        <span>{{ structure.city }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-configuration-info__content__label fr-mr-1w">
          {{ structureFieldLabels.phone }} :
        </span>
        <span>{{ structure.phone }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-configuration-info__content__label fr-mr-1w">
          {{ structureFieldLabels.email }} :
        </span>
        <span>{{ structure.email }}</span>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--right">
      <div>
        <button
          class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-edit-line"
          data-fr-opened="false"
          aria-controls="global-modal"
          title="Modifier"
          aria-label="Modifier"
          @click="emit('edit')"
        >
          Modifier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { StructureInfo } from './types'
  import { structureFieldLabels } from '~/client/labels'

  defineProps<{
    structure: StructureInfo
  }>()

  const emit = defineEmits<{ edit: [] }>()
</script>

<style scoped lang="css">
  .structure-configuration-info > div:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .structure-configuration-info__title {
    color: var(--primary);
  }

  .structure-configuration-info__content {
    gap: 0.5rem;
  }

  .structure-configuration-info__content__label {
    font-weight: 700;
  }
</style>
