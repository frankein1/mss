<template>
  <div class="feature-section bg-color-white structure-info">
    <h2 class="fr-h4">Informations sur la structure</h2>

    <ul class="information-list">
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.type }}&nbsp;:
        </span>
        {{ structureTypeKeys.value(structure.type) }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.inhabitantsNumber }}&nbsp;:
        </span>
        {{ structure.inhabitantsNumber }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.inseeCode }}&nbsp;:
        </span>
        {{ structure.inseeCode }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.siret }}&nbsp;:
        </span>
        {{ structure.siret }}
      </li>
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

    <h3 class="fr-text--lg fr-mt-3v fr-mb-3v grey">
      Personne référente à la protection des données (DPO)&nbsp;:
    </h3>

    <ul class="information-list">
      <li>
        <span class="fr-text--bold"> Prénom et nom&nbsp;: </span>
        {{ structure.dpoFirstName }} {{ structure.dpoLastName }}
      </li>
      <li>
        <span class="fr-text--bold">
          {{ structureFieldLabels.dpoEmail }}&nbsp;:
        </span>
        {{ structure.dpoEmail }}
      </li>
    </ul>

    <div class="fr-grid-row fr-grid-row--right">
      <button
        class="fr-mr-1w fr-btn fr-btn--secondary btn-delete-action fr-btn--icon-left fr-icon-delete-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        title="Désactiver"
        aria-label="Désactiver"
        @click="emit('disable')"
      >
        Désactiver
      </button>
      <button
        class="fr-btn fr-btn--icon-left fr-icon-edit-line"
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

  <div class="feature-section bg-color-white structure-info">
    <h2 class="fr-h4">Intégrations</h2>

    <div>
      <DsfrToggleSwitch
        label="Rendez-vous Service Public"
        :model-value="structure.externalRdvspActive || undefined"
        @update:model-value="emit('toggleRdv', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { StructureInfo } from './types'
  import { structureFieldLabels } from '~~/client/labels'
  import { structureTypeKeys } from '~~/client/options'

  defineProps<{
    structure: StructureInfo
  }>()

  const emit = defineEmits<{
    edit: []
    disable: []
    toggleRdv: [value: boolean]
  }>()
</script>

<style scoped lang="css">
  .structure-info:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .grey {
    color: var(--text-default-grey);
  }
</style>
