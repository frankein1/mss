<template>
  <div class="feature-section bg-color-white structure-info">
    <h2 class="fr-h4 structure-info__title">
      Informations sur votre structure
    </h2>

    <div class="fr-grid-row structure-info__content">
      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.name }} :
        </span>
        <span>{{ structure.name }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.address }} :
        </span>
        <span>{{ structure.address }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.zipcode }} :
        </span>
        <span>{{ structure.zipcode }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.city }} :
        </span>
        <span>{{ structure.city }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.phone }} :
        </span>
        <span>{{ structure.phone }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.email }} :
        </span>
        <span>{{ structure.email }}</span>
      </div>

      <div class="fr-col-12 fr-mt-1w">
        <h3 class="fr-mb-0 fr-text--lg grey">
          Personne référente à la protection des données (DPO)&nbsp;:
        </h3>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          Prénom et nom :
        </span>
        <span>{{ structure.dpoFirstName }} {{ structure.dpoLastName }}</span>
      </div>

      <div class="fr-col-12">
        <span class="structure-info__content__label fr-mr-1w">
          {{ structureFieldLabels.dpoEmail }} :
        </span>
        <span>{{ structure.dpoEmail }}</span>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--right">
      <div v-if="application.edit.structure">
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

  const { application } = usePermissions()
</script>

<style scoped lang="css">
  .structure-info > div:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .structure-info__title {
    color: var(--primary);
  }

  .structure-info__content {
    gap: 0.5rem;
  }

  .structure-info__content__label {
    font-weight: 700;
  }

  .grey {
    color: var(--text-default-grey);
  }
</style>
