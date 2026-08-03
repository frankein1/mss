<template>
  <section class="feature-section structure-info fr-p-5v fr-p-md-10v">
    <h3 class="fr-h4 structure-info__title">
      Informations sur votre structure
    </h3>

    <ul class="information-list">
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.name }}&nbsp;:
        </span>
        {{ structure.name }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.address }}&nbsp;:
        </span>
        {{ structure.address }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.zipcode }}&nbsp;:
        </span>
        {{ structure.zipcode }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.city }}&nbsp;:
        </span>
        {{ structure.city }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.phone }}&nbsp;:
        </span>
        {{ structure.phone }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.email }}&nbsp;:
        </span>
        {{ structure.email }}
      </li>
    </ul>

    <h4 class="fr-h6 fr-mt-4v fr-mb-3v">
      Personne référente à la protection des données (DPO)&nbsp;:
    </h4>

    <ul class="information-list">
      <li>
        <span class="fr-text--bold"> Prénom et nom&nbsp;: </span>
        {{ structure.dpoFirstName }} {{ structure.dpoLastName }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.dpoEmail }} :
        </span>
        {{ structure.dpoEmail }}
      </li>
    </ul>

    <div
      v-if="application.edit.structure"
      class="fr-grid-row fr-grid-row--right"
    >
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
  </section>
</template>

<script setup lang="ts">
  import type { StructureInfo } from './types'
  import { structureFieldLabels } from '~/client/labels'

  defineProps<{
    structure: StructureInfo
  }>()

  const emit = defineEmits<{ edit: [] }>()

  const { application } = usePermissions()
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .structure-info__title {
    color: var(--primary);
    font-size: 1.5rem;

    @include dsfr-media-query.respond-from('md') {
      font-size: 2.5rem;
    }
  }
</style>
